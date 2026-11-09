
create type public.app_role as enum ('super_admin','content_admin','media_manager','editor');
create type public.pub_status as enum ('draft','published','archived');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select, insert, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.has_any_role(_user_id uuid, _roles public.app_role[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = any(_roles))
$$;
create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id)
$$;

create policy "own roles or super admin read" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'super_admin'));
create policy "super admin insert roles" on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(),'super_admin'));
create policy "super admin delete roles" on public.user_roles for delete to authenticated
  using (public.has_role(auth.uid(),'super_admin'));

create or replace function public.bootstrap_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles) then
    insert into public.user_roles(user_id, role) values (new.id, 'super_admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_bootstrap after insert on auth.users
  for each row execute function public.bootstrap_first_admin();

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "staff read profiles" on public.profiles for select to authenticated using (id = auth.uid() or public.is_staff(auth.uid()));
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid());
create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, email, display_name) values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  return new;
end $$;
create trigger on_auth_user_created_profile after insert on auth.users
  for each row execute function public.handle_new_profile();

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admins write settings" on public.site_settings for all to authenticated
  using (public.has_any_role(auth.uid(), array['super_admin','content_admin']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['super_admin','content_admin']::public.app_role[]));

create table public.biography_sections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  body text not null default '',
  image_url text,
  sources jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  status public.pub_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.leadership_timeline (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  period text not null default '',
  start_date date,
  description text not null default '',
  image_url text,
  sources jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  status public.pub_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.public_engagements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Public statement',
  event_date date not null default current_date,
  venue text not null default '',
  description text not null default '',
  image_url text,
  media_url text,
  related_links jsonb not null default '[]'::jsonb,
  status public.pub_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.public_engagements(event_date desc);
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind text not null default 'image' check (kind in ('image','video','press','publication')),
  url text not null,
  thumbnail_url text,
  category text not null default 'General',
  caption text not null default '',
  credit text not null default '',
  status public.pub_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  category text not null default 'Updates',
  image_url text,
  author text not null default 'Office of Anthony Nukpenu',
  citations jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  status public.pub_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.news_articles(published_at desc);
create table public.financial_disclosures (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  reporting_period text not null default '',
  category text not null default 'Funding disclosure',
  summary text not null default '',
  amount_ghs numeric(14,2),
  document_url text,
  published_on date,
  status public.pub_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['biography_sections','leadership_timeline','public_engagements','media_assets','news_articles','financial_disclosures'] loop
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create trigger touch_%s before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
  foreach t in array array['biography_sections','leadership_timeline','public_engagements','media_assets','financial_disclosures'] loop
    execute format('create policy "public read published" on public.%I for select to anon, authenticated using (status = ''published'' or public.is_staff(auth.uid()))', t);
  end loop;
end $$;

create policy "public read published news" on public.news_articles for select to anon, authenticated
  using ((status = 'published' and (published_at is null or published_at <= now())) or public.is_staff(auth.uid()));

create policy "editors write bio" on public.biography_sections for all to authenticated
  using (public.has_any_role(auth.uid(), array['super_admin','content_admin','editor']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['super_admin','content_admin','editor']::public.app_role[]));
create policy "editors write timeline" on public.leadership_timeline for all to authenticated
  using (public.has_any_role(auth.uid(), array['super_admin','content_admin','editor']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['super_admin','content_admin','editor']::public.app_role[]));
create policy "editors write engagements" on public.public_engagements for all to authenticated
  using (public.has_any_role(auth.uid(), array['super_admin','content_admin','editor','media_manager']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['super_admin','content_admin','editor','media_manager']::public.app_role[]));
create policy "media write" on public.media_assets for all to authenticated
  using (public.has_any_role(auth.uid(), array['super_admin','content_admin','media_manager']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['super_admin','content_admin','media_manager']::public.app_role[]));
create policy "editors write news" on public.news_articles for all to authenticated
  using (public.has_any_role(auth.uid(), array['super_admin','content_admin','editor']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['super_admin','content_admin','editor']::public.app_role[]));
create policy "admins write finance" on public.financial_disclosures for all to authenticated
  using (public.has_any_role(auth.uid(), array['super_admin','content_admin']::public.app_role[]))
  with check (public.has_any_role(auth.uid(), array['super_admin','content_admin']::public.app_role[]));

create table public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  ip_hash text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.contact_enquiries(ip_hash, created_at);
grant select, update, delete on public.contact_enquiries to authenticated;
grant all on public.contact_enquiries to service_role;
alter table public.contact_enquiries enable row level security;
create policy "admins read enquiries" on public.contact_enquiries for select to authenticated
  using (public.has_any_role(auth.uid(), array['super_admin','content_admin']::public.app_role[]));
create policy "admins update enquiries" on public.contact_enquiries for update to authenticated
  using (public.has_any_role(auth.uid(), array['super_admin','content_admin']::public.app_role[]));
create policy "admins delete enquiries" on public.contact_enquiries for delete to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

create table public.audit_logs (
  id bigserial primary key,
  actor_id uuid,
  actor_email text,
  table_name text not null,
  action text not null,
  record_id text,
  summary text,
  created_at timestamptz not null default now()
);
grant select on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;
create policy "staff read audit" on public.audit_logs for select to authenticated using (public.is_staff(auth.uid()));

create or replace function public.write_audit() returns trigger language plpgsql security definer set search_path = public as $$
declare rec jsonb; uid uuid := auth.uid();
begin
  if uid is null then return coalesce(new, old); end if;
  if tg_op = 'DELETE' then rec := to_jsonb(old); else rec := to_jsonb(new); end if;
  insert into public.audit_logs(actor_id, actor_email, table_name, action, record_id, summary)
  values (uid, (select email from public.profiles where id = uid), tg_table_name, lower(tg_op),
          rec->>'id', coalesce(rec->>'title', rec->>'key', rec->>'subject', rec->>'role'));
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;
do $$
declare t text;
begin
  foreach t in array array['biography_sections','leadership_timeline','public_engagements','media_assets','news_articles','financial_disclosures','contact_enquiries','site_settings','user_roles'] loop
    execute format('create trigger audit_%s after insert or update or delete on public.%I for each row execute function public.write_audit()', t, t);
  end loop;
end $$;

create policy "staff read media objects" on storage.objects for select to authenticated
  using (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "staff upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff(auth.uid())
    and lower(storage.extension(name)) in ('jpg','jpeg','png','webp','avif','pdf'));
create policy "staff update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "staff delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_staff(auth.uid()));

insert into public.site_settings(key, value) values
('contact', '{"email":"","phone":"","office":"Greater Accra Regional Office, National Democratic Congress, Accra, Ghana"}'),
('social', '{"facebook":"","instagram":"","tiktok":"","x":"","youtube":""}'),
('portrait', '{"url":""}');

insert into public.biography_sections(slug,title,body,sources,sort_order,status) values
('introduction','Personal introduction','Anthony Kwame Mensah Nukpenu is the Greater Accra Regional Organiser of the National Democratic Congress (NDC). He has served the party in the Greater Accra Region across multiple terms and is a regular voice on national television and radio on party organisation and public affairs.',
 '[{"label":"GBC Ghana, 14 Nov 2022","url":"https://www.gbcghanaonline.com/news/politics/ndc/2022/"}]',1,'published'),
('political-journey','Political and organisational journey','At the NDC Greater Accra Regional Congress held at the Tema Sports Stadium on 13 November 2022, Mr Nukpenu was retained as Regional Organiser for a third term, polling 595 votes against 404 for his contender.',
 '[{"label":"Citi Newsroom — full regional results","url":"https://www.citinewsroom.com/2022/11/how-ndc-delegates-voted-in-the-regional-elections-full-results/"},{"label":"GBC Ghana","url":"https://www.gbcghanaonline.com/news/politics/ndc/2022/"}]',2,'published'),
('current-responsibilities','Current responsibilities','He serves as Greater Accra Regional Organiser of the NDC and has been reported as a Presidential Staffer for Political Affairs.',
 '[{"label":"Africa Briefing, 2026","url":"https://africabriefing.com/ghana-term-limit-row-widens-beyond-court/"}]',3,'published'),
('early-life','Background and early life','[Placeholder — awaiting approved details on place of birth, hometown and early life. Do not publish until verified.]','[]',4,'draft'),
('education','Education and professional development','[Placeholder — awaiting verified education and professional qualifications.]','[]',5,'draft'),
('community','Public service and community engagements','[Placeholder — awaiting approved record of community and public service work.]','[]',6,'draft');

insert into public.leadership_timeline(title,period,start_date,description,sources,sort_order,status) values
('Re-elected Greater Accra Regional Organiser — third term','November 2022','2022-11-13','Retained as Regional Organiser at the NDC Greater Accra Regional Congress, Tema Sports Stadium, with 595 votes to 404.',
 '[{"label":"Citi Newsroom","url":"https://www.citinewsroom.com/2022/11/how-ndc-delegates-voted-in-the-regional-elections-full-results/"},{"label":"3News","url":"https://3news.com/news/politics/ndc-polls-ashie-moore-defeats-ade-coker-in-greater-accra"}]',1,'published'),
('Regional organisation for the 2024 general elections','2024','2024-12-07','Served as Regional Organiser during the 2024 general elections, in which the NDC won 29 of the 34 parliamentary seats in Greater Accra, as reported by Metro TV.',
 '[{"label":"Metro TV Online","url":"https://metrotvonline.com/greater-accra-ndc-organizer-anthony-nukpenu-eyes-national-executive-role-ahead-of-2028-elections/"}]',2,'published'),
('Presidential Staffer for Political Affairs','2025 – present','2025-01-01','Reported as Presidential Staffer for Political Affairs while continuing as Greater Accra Regional Organiser.',
 '[{"label":"Africa Briefing","url":"https://africabriefing.com/ghana-term-limit-row-widens-beyond-court/"}]',3,'published'),
('Declared intention to contest a national executive role','2026','2026-05-20','Declared his intention to contest a national executive position of the NDC ahead of the party''s internal elections.',
 '[{"label":"Asaase Radio","url":"https://asaaseradio.com/ndc-elections-anthony-nukpenu-joins-ndc-deputy-general-secretary-race/"},{"label":"Metro TV Online","url":"https://metrotvonline.com/greater-accra-ndc-organizer-anthony-nukpenu-eyes-national-executive-role-ahead-of-2028-elections/"}]',4,'published'),
('First election as Regional Organiser','[Date to be verified]',null,'[Placeholder — awaiting verified date and record of first election as Regional Organiser.]','[]',0,'draft');

insert into public.public_engagements(title,category,event_date,venue,description,media_url,status) values
('On youth employment and the jobs agenda','Television interview','2026-01-07','Channel One TV — Breakfast Daily','Discussed the government''s jobs commitments and urged young people to pursue emerging opportunities.','https://www.citinewsroom.com/2026/01/jobs-wont-walk-to-you-seek-them-ndcs-nukpenu-to-unemployed-youth/','published'),
('Ayawaso East by-election outlook','Television interview','2026-02-27','Citi TV — Eyewitness News','Spoke on the NDC''s preparations for the Ayawaso East by-election of 3 March 2026.','https://www.citinewsroom.com/2026/02/ayawaso-east-by-election-umar-sanda-wont-make-2-ndc/','published'),
('On flooding in Accra and urban planning','Radio interview','2026-06-30','Adom FM — Dwaso Nsem','Commented on encroachment on waterways and wetlands following heavy rains in Accra.','https://www.adomonline.com/accra-floods-not-a-disaster-god-has-exposed-our-irresponsibility-nukpenu-video/','published'),
('On national executive ambitions ahead of 2028','Television interview','2026-07-29','Metro TV','Discussed planning and coordination for the party''s national operations.','https://metrotvonline.com/greater-accra-ndc-organizer-anthony-nukpenu-eyes-national-executive-role-ahead-of-2028-elections/','published'),
('On the Council of State election in Greater Accra','Radio interview','2025-02-12','3FM — Morning Show','Responded to reports about the Council of State election held in the region on 11 February 2025.','https://3news.com/news/ndc-greater-accra-regional-organiser-denies-using-thugs-to-disrupt-council-of-state-election','published');

insert into public.news_articles(slug,title,excerpt,body,category,status) values
('sample-draft-article','[Draft] Sample update — not published','Placeholder article for the editorial team. Replace with an approved update.','This is unpublished placeholder content to show how articles are created. Edit and publish only after approval.','Updates','draft');
