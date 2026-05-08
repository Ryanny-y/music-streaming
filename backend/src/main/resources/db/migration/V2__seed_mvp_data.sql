insert into roles (role_name)
values
    ('USER'),
    ('ADMIN')
on conflict (role_name) do nothing;

insert into categories (name, description)
values
    ('Pop', 'Popular music and chart-friendly releases.'),
    ('Rock', 'Guitar-driven music across classic and modern rock.'),
    ('Hip-Hop', 'Rap, hip-hop, and rhythm-focused tracks.'),
    ('R&B', 'Rhythm and blues, soul, and smooth vocal music.'),
    ('Electronic', 'Electronic, dance, house, and synth-based music.'),
    ('Jazz', 'Jazz standards, fusion, and improvisational music.'),
    ('Classical', 'Orchestral, chamber, and classical compositions.'),
    ('Indie', 'Independent and alternative releases.'),
    ('Acoustic', 'Stripped-back acoustic performances.'),
    ('Workout', 'High-energy tracks for training and movement.')
on conflict (name) do nothing;

insert into tags (name)
values
    ('Trending'),
    ('New Release'),
    ('Chill'),
    ('Focus'),
    ('Party'),
    ('Workout'),
    ('Throwback'),
    ('Instrumental'),
    ('Live'),
    ('Explicit'),
    ('Clean'),
    ('Featured')
on conflict (name) do nothing;
