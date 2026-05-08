create extension if not exists pgcrypto;

create table roles (
    role_id bigserial primary key,
    role_name varchar(50) not null unique
);

create table users (
    user_id uuid primary key default gen_random_uuid(),
    full_name varchar(150) not null,
    username varchar(80) not null unique,
    email varchar(150) not null unique,
    password_hash varchar(255) not null,
    role_id bigint not null references roles(role_id),
    is_active boolean default true,
    refresh_token text,
    refresh_token_exp timestamp,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create table categories (
    category_id uuid primary key default gen_random_uuid(),
    name varchar(100) not null unique,
    description text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create table tags (
    tag_id uuid primary key default gen_random_uuid(),
    name varchar(100) not null unique,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create table songs (
    song_id uuid primary key default gen_random_uuid(),
    title varchar(150) not null,
    artist varchar(150) not null,
    album varchar(150),
    description text,
    lyrics text,
    audio_url text,
    cover_image_url text,
    duration varchar(20),
    release_date date,
    category_id uuid references categories(category_id),
    status varchar(30) not null default 'UNPUBLISHED',
    play_count bigint default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create table song_tags (
    song_id uuid not null references songs(song_id) on delete cascade,
    tag_id uuid not null references tags(tag_id) on delete cascade,
    primary key (song_id, tag_id)
);

create table favorites (
    favorite_id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(user_id) on delete cascade,
    song_id uuid not null references songs(song_id) on delete cascade,
    created_at timestamp default current_timestamp,
    unique (user_id, song_id)
);

create table listening_history (
    history_id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(user_id) on delete cascade,
    song_id uuid not null references songs(song_id) on delete cascade,
    played_at timestamp default current_timestamp
);

create index idx_users_role_id on users(role_id);
create index idx_users_is_active on users(is_active);
create index idx_users_username_lower on users(lower(username));
create index idx_users_email_lower on users(lower(email));

create index idx_categories_name_lower on categories(lower(name));

create index idx_tags_name_lower on tags(lower(name));

create index idx_songs_category_id on songs(category_id);
create index idx_songs_status on songs(status);
create index idx_songs_release_date on songs(release_date);
create index idx_songs_play_count on songs(play_count desc);
create index idx_songs_title_lower on songs(lower(title));
create index idx_songs_artist_lower on songs(lower(artist));
create index idx_songs_album_lower on songs(lower(album));
create index idx_songs_search_text on songs using gin (
    to_tsvector(
        'simple',
        coalesce(title, '') || ' ' ||
        coalesce(artist, '') || ' ' ||
        coalesce(album, '') || ' ' ||
        coalesce(description, '')
    )
);

create index idx_song_tags_tag_id on song_tags(tag_id);

create index idx_favorites_user_id on favorites(user_id);
create index idx_favorites_song_id on favorites(song_id);
create index idx_favorites_created_at on favorites(created_at);

create index idx_listening_history_user_played_at on listening_history(user_id, played_at desc);
create index idx_listening_history_song_id on listening_history(song_id);
create index idx_listening_history_played_at on listening_history(played_at desc);
