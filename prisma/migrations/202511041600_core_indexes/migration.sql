-- Migration: core indexes & constraints for favorites, appointments, property analytics
-- Generated 2025-11-04

BEGIN;

-- Ensure favorites cannot duplicate the same property for a single user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'favorites_user_property_unique'
  ) THEN
    ALTER TABLE favorites
      ADD CONSTRAINT favorites_user_property_unique UNIQUE (user_id, property_id);
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property ON favorites(property_id);

-- Avoid double-booking the same appointment slot and speed up lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_unique_slot
  ON appointments (client_id, agent_id, property_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_agent ON appointments(agent_id);
CREATE INDEX IF NOT EXISTS idx_appointments_property ON appointments(property_id);

-- Daily analytics rollup should remain unique per property/date
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_analytics_daily
  ON property_analytics (property_id, analytics_date);

COMMIT;
