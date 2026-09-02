insert into public.customers (name)
select 'Sample Customer'
where not exists (
  select 1 from public.customers where lower(name) = lower('Sample Customer')
);

insert into public.projects (project_code, name, customer_id, site_address)
select
  'SAMPLE-001',
  'Sample Project',
  c.id,
  '123 Demo Street, Orlando, FL'
from public.customers c
where lower(c.name) = lower('Sample Customer')
  and not exists (
    select 1 from public.projects where project_code = 'SAMPLE-001'
  );