create table todo_list(
	id serial primary  key,
	todo text NOT NULL,
	updated timestamp default current_timestamp
);

create or replace function updated() returns trigger
language plpgsql
as $$
begin
	if new.todo not ilike old.todo then
		new.updated = current_timestamp;
	end if;
	return new;
end;
$$;

create trigger trigger_todo_updated
before update on todo_list
for each row
execute procedure updated();