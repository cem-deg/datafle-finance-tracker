"""Add currency_code to budgets

Revision ID: 20260407_0003
Revises: 20260405_0002
Create Date: 2026-04-07 23:30:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260407_0003"
down_revision = "20260405_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()

    if bind.dialect.name == "sqlite":
        with op.batch_alter_table("budgets", recreate="always") as batch_op:
            batch_op.add_column(
                sa.Column(
                    "currency_code",
                    sa.String(length=3),
                    nullable=False,
                    server_default="USD",
                )
            )
            batch_op.alter_column(
                "currency_code",
                existing_type=sa.String(length=3),
                server_default=None,
            )
    else:
        op.add_column(
            "budgets",
            sa.Column(
                "currency_code",
                sa.String(length=3),
                nullable=False,
                server_default="USD",
            ),
        )
        op.alter_column(
            "budgets",
            "currency_code",
            existing_type=sa.String(length=3),
            server_default=None,
        )


def downgrade() -> None:
    op.drop_column("budgets", "currency_code")
