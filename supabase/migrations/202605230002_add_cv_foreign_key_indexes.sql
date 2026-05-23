create index if not exists education_entries_cv_id_idx on public.education_entries(cv_id);
create index if not exists experience_entries_cv_id_idx on public.experience_entries(cv_id);
create index if not exists project_entries_cv_id_idx on public.project_entries(cv_id);
create index if not exists achievement_entries_cv_id_idx on public.achievement_entries(cv_id);
create index if not exists skill_entries_cv_id_idx on public.skill_entries(cv_id);
create index if not exists language_entries_cv_id_idx on public.language_entries(cv_id);
create index if not exists certification_entries_cv_id_idx on public.certification_entries(cv_id);
create index if not exists generated_sections_cv_id_idx on public.generated_sections(cv_id);
