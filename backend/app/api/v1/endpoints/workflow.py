"""Workflow endpoint definitions (API v1)."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
import re
from typing import Any

from app.models.claim import ClaimIn, ClaimOut
from app.services.claim_processing import run as run_workflow
from app.sample_data import ALL_SAMPLE_CLAIMS

router = APIRouter(tags=["workflow"])

# Regex compiled once
DECISION_PATTERN = re.compile(
    r"\b(APPROVED|DENIED|REQUIRES_INVESTIGATION)\b", re.IGNORECASE)


def get_sample_claim_by_id(claim_id: str) -> dict:
    """Retrieve sample claim data by claim_id."""
    for claim in ALL_SAMPLE_CLAIMS:
        if claim.get("claim_id") == claim_id:
            return claim

    # If not found, list available claim IDs
    available_ids = [claim.get("claim_id") for claim in ALL_SAMPLE_CLAIMS]
    raise HTTPException(
        status_code=404,
        detail=f"Claim ID '{claim_id}' not found. Available sample claim IDs: {available_ids}"
    )


@router.get("/workflow/sample-claims")
async def list_sample_claims():
    """List all available sample claims for testing."""
    claims_summary = []
    for claim in ALL_SAMPLE_CLAIMS:
        claims_summary.append({
            "claim_id": claim.get("claim_id"),
            "claimant_name": claim.get("claimant_name"),
            "claim_type": claim.get("claim_type"),
            "estimated_damage": claim.get("estimated_damage"),
            "description": claim.get("description", "")
        })

    return {
        "available_claims": claims_summary,
        "usage": "Use POST /api/v1/workflow/run with {'claim_id': 'CLM-2024-001'} to process a sample claim"
    }


@router.post("/workflow/run", response_model=ClaimOut)
async def workflow_run(claim: ClaimIn):  # noqa: D401
    """Run the claim through the multi-agent workflow and return full trace.

    Accepts either:
    - A claim_id to load sample data: {"claim_id": "CLM-2024-001"}
    - Full claim data: {"claim_id": "...", "policy_number": "...", ...}
    """

    try:
        # ------------------------------------------------------------------
        # 1. Decide whether to load sample claim or use provided data
        # ------------------------------------------------------------------
        # Load sample data if claim_id provided and matches sample claim
        if claim.claim_id:
            claim_data = get_sample_claim_by_id(claim.claim_id)

            # Merge/override with any additional fields supplied in request (e.g., supporting_documents)
            override_data = {
                k: v for k, v in claim.model_dump(by_alias=True, exclude_none=True).items()
                if k != "claim_id"
            }

            # Apply overrides (including supporting_images) on top of sample claim
            claim_data.update(override_data)
        else:
            # Full claim provided without loading sample
            claim_data = claim.to_dict()

        # ------------------------------------------------------------------
        # 2. Stream LangGraph execution; capture both grouped & chronological
        # ------------------------------------------------------------------
        chronological: list[dict[str, str]] = []
        seen_lengths: dict[str, int] = {}

        chunks = []
        for chunk in run_workflow(claim_data):
            chunks.append(chunk)

            # Process each node in the chunk (now we get individual agent updates)
            for node_name, node_data in chunk.items():
                if node_name == "__end__":
                    continue

                # Handle different data structures
                if isinstance(node_data, list):
                    msgs = node_data
                elif isinstance(node_data, dict) and "messages" in node_data:
                    msgs = node_data["messages"]
                elif isinstance(node_data, dict) and set(node_data.keys()) == {"messages"}:
                    # Handle supervisor-style single messages key
                    msgs = node_data["messages"]
                else:
                    continue

                prev_len = seen_lengths.get(node_name, 0)
                new_msgs = msgs[prev_len:]

                for msg in new_msgs:
                    chronological.append(_serialize_msg(node_name, msg))

                seen_lengths[node_name] = len(msgs)

        # ------------------------------------------------------------------
        # 3. Extract final decision from chronological messages
        # ------------------------------------------------------------------
        final_decision: str | None = None

        # Extract final decision scanning chronological reverse order
        for entry in reversed(chronological):
            match = DECISION_PATTERN.search(entry["content"])
            if match:
                final_decision = match.group(1).upper()
                break

        # ------------------------------------------------------------------
        # 4. Return response with chronological stream only
        # ------------------------------------------------------------------
        return ClaimOut(
            success=True,
            final_decision=final_decision,
            conversation_chronological=chronological,
        )

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ------------------------------------------------------------------
# Helper serialization
# ------------------------------------------------------------------


def _serialize_msg(node: str, msg: Any, *, include_node: bool = True) -> dict:  # noqa: D401
    """Return a serializable dict for a LangChain message including tool calls."""
    role = getattr(msg, "role", getattr(msg, "type", "assistant"))

    # Handle tool call messages (AIMessage with tool_calls attr)
    if hasattr(msg, "tool_calls") and msg.tool_calls:
        content_repr = f"TOOL_CALL: {msg.tool_calls}"
    else:
        content_repr = getattr(msg, "content", str(msg)) or ""

    data = {
        "role": role,
        "content": content_repr.strip(),
    }
    if include_node:
        data["node"] = node
    return data
