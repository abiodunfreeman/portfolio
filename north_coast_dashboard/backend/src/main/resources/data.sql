-- Fictional demo data. All phone numbers use the reserved 555-01xx range.
-- Hikari sets every H2 connection to America/New_York before this script runs.
-- Dates follow the current Cleveland week; restarting restores the sample data.
INSERT INTO customers (id, name, phone, email, address, suburb) VALUES
  (1, 'Melissa Reynolds', '(216) 555-0101', 'melissa.reynolds@example.com', '1482 Warren Road', 'Lakewood'),
  (2, 'James Thompson', '(440) 555-0102', 'james.thompson@example.com', '27614 Center Ridge Road', 'Westlake'),
  (3, 'Angela Martinez', '(216) 555-0103', 'angela.martinez@example.com', '6218 Ridge Road', 'Parma'),
  (4, 'David Kowalski', '(440) 555-0104', 'david.kowalski@example.com', '18224 Drake Road', 'Strongsville'),
  (5, 'Priya Shah', '(216) 555-0105', 'priya.shah@example.com', '24310 Fairmount Boulevard', 'Beachwood'),
  (6, 'Robert Lawson', '(216) 555-0106', 'robert.lawson@example.com', '19814 Van Aken Boulevard', 'Shaker Heights'),
  (7, 'Nicole Bennett', '(440) 555-0107', 'nicole.bennett@example.com', '7326 Lakeshore Boulevard', 'Mentor'),
  (8, 'Marcus Johnson', '(216) 555-0108', 'marcus.johnson@example.com', '3216 West 44th Street', 'Cleveland'),
  (9, 'Elena Petrov', '(216) 555-0109', 'elena.petrov@example.com', '1738 Marlowe Avenue', 'Lakewood'),
  (10, 'Brian O''Malley', '(440) 555-0110', 'brian.omalley@example.com', '25342 Detroit Road', 'Westlake'),
  (11, 'Denise Walker', '(216) 555-0111', 'denise.walker@example.com', '5742 Pearl Road', 'Parma'),
  (12, 'Samuel Chen', '(440) 555-0112', 'samuel.chen@example.com', '8456 Johnnycake Ridge Road', 'Mentor');

INSERT INTO technicians (id, name, initials, specialty, color) VALUES
  (1, 'Mike Sullivan', 'MS', 'AC & heat pumps', '#477A9B'),
  (2, 'Alicia Brooks', 'AB', 'Furnaces & installation', '#9871B5'),
  (3, 'Daniel Rivera', 'DR', 'Maintenance & diagnostics', '#B87B48'),
  (4, 'Jordan Price', 'JP', 'Controls & indoor comfort', '#4F947C');

-- A mix of current-day dispatch, upcoming work and completed work.
INSERT INTO jobs (id, title, description, service_type, status, scheduled_date, scheduled_time, duration_minutes, amount, customer_id, technician_id) VALUES
  (1, 'AC not cooling upstairs', 'Inspect the condenser and refrigerant circuit. Customer reports warm air from second-floor vents.', 'ac-repair', 'in-progress', CURRENT_DATE, '09:00', 90, 385.00, 1, 1),
  (2, 'High-efficiency furnace installation', 'Replace the aging furnace with a correctly sized high-efficiency unit; haul away old equipment and test operation.', 'furnace-installation', 'scheduled', CURRENT_DATE, '10:30', 300, 6200.00, 2, 2),
  (3, 'Comfort Club seasonal tune-up', 'Complete the seasonal inspection, clean accessible components, and document filter and thermostat settings.', 'maintenance', 'scheduled', CURRENT_DATE, '13:00', 60, 199.00, 3, 3),
  (4, 'Smart thermostat setup', 'Install the customer-approved smart thermostat and walk through scheduling and Wi-Fi controls.', 'thermostat', 'scheduled', CURRENT_DATE, '15:00', 75, 295.00, 5, 4),
  (5, 'Heat-pump performance check', 'Evaluate uneven temperatures and review heat-pump operating performance before recommending repairs.', 'heat-pump', 'scheduled', DATEADD('DAY', 1, CURRENT_DATE), '08:30', 90, 189.00, 4, 1),
  (6, 'Furnace safety inspection', 'Inspect burners, ignition, venting and safety controls as part of the annual maintenance visit.', 'maintenance', 'scheduled', DATEADD('DAY', 2, CURRENT_DATE), '09:00', 60, 199.00, 6, 2),
  (7, 'Cooling diagnostic visit', 'Diagnose the intermittent system shutdown and provide an itemized repair estimate before proceeding.', 'diagnostic', 'scheduled', DATEADD('DAY', 3, CURRENT_DATE), '11:00', 60, 89.00, 7, 3),
  (8, 'AC capacitor replacement', 'Replaced the failed run capacitor and verified startup amperage and cooling performance.', 'ac-repair', 'completed', DATEADD('DAY', 1 - ISO_DAY_OF_WEEK(CURRENT_DATE), CURRENT_DATE), '08:00', 60, 275.00, 8, 1),
  (9, 'New furnace commissioning', 'Completed furnace installation, combustion checks, thermostat setup and homeowner orientation.', 'furnace-installation', 'completed', DATEADD('DAY', 1 - ISO_DAY_OF_WEEK(CURRENT_DATE), CURRENT_DATE), '08:00', 360, 5850.00, 9, 2),
  (10, 'Annual system maintenance', 'Cleaned accessible coils, changed the supplied filter and completed the system performance checklist.', 'maintenance', 'completed', DATEADD('DAY', 1 - ISO_DAY_OF_WEEK(CURRENT_DATE), CURRENT_DATE), '08:00', 60, 199.00, 10, 3),
  (11, 'Thermostat wiring repair', 'Repaired a low-voltage connection and verified the thermostat controls heating and cooling correctly.', 'thermostat', 'completed', CURRENT_DATE, '08:00', 45, 165.00, 11, 4),
  (12, 'Blower motor replacement', 'Installed the approved replacement blower motor and confirmed stable airflow throughout the home.', 'ac-repair', 'completed', DATEADD('DAY', -2, DATEADD('DAY', 1 - ISO_DAY_OF_WEEK(CURRENT_DATE), CURRENT_DATE)), '10:00', 120, 745.00, 12, 1),
  (13, 'Seasonal maintenance visit', 'Customer requested cancellation after a change in travel plans. No service performed or charge applied.', 'maintenance', 'cancelled', CURRENT_DATE, '14:30', 60, 199.00, 1, 3),
  (14, 'Replacement furnace estimate', 'Customer chose to postpone the equipment estimate until after planned home renovations.', 'diagnostic', 'cancelled', DATEADD('DAY', 2, CURRENT_DATE), '15:30', 60, 89.00, 4, 2),
  (15, 'No-cool system diagnosis', 'Investigating a cooling interruption; customer approved the diagnostic visit before repair recommendations.', 'diagnostic', 'in-progress', CURRENT_DATE, '11:30', 90, 89.00, 8, 1);

ALTER TABLE jobs ALTER COLUMN id RESTART WITH 16;
