UPDATE onboarding_answers
SET goals = '["skin","jawline"]'::jsonb,
    skin = '["acne","texture"]'::jsonb,
    comfort = '["products","clinics"]'::jsonb,
    budget = 'standard',
    routine = '15min',
    updated_at = now()
WHERE user_id = 'user_mock_1';