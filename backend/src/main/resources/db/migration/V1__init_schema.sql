create table app_users (
    id bigserial primary key,
    email varchar(255) not null unique,
    display_name varchar(120) not null,
    password_hash varchar(255) not null,
    role varchar(40) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table categories (
    id bigserial primary key,
    name varchar(120) not null unique,
    slug varchar(140) not null unique,
    created_at timestamptz not null default now()
);

create table tags (
    id bigserial primary key,
    name varchar(120) not null unique,
    slug varchar(140) not null unique,
    created_at timestamptz not null default now()
);

create table songs (
    id bigserial primary key,
    title varchar(255) not null,
    artist_name varchar(255) not null,
    album_name varchar(255),
    duration_seconds integer not null,
    audio_url text not null,
    cover_art_url text,
    category_id bigint references categories(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table song_tags (
    song_id bigint not null references songs(id) on delete cascade,
    tag_id bigint not null references tags(id) on delete cascade,
    primary key (song_id, tag_id)
);

create table favorites (
    user_id bigint not null references app_users(id) on delete cascade,
    song_id bigint not null references songs(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, song_id)
);

create table listening_history (
    id bigserial primary key,
    user_id bigint not null references app_users(id) on delete cascade,
    song_id bigint not null references songs(id) on delete cascade,
    listened_at timestamptz not null default now()
);
