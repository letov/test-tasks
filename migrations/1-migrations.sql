CREATE TABLE public."user"
(
    uid uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    nickname VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE public."tag"
(
    id SERIAL PRIMARY KEY,
    creator uuid REFERENCES public."user"(uid) ON DELETE CASCADE,
    name VARCHAR(40) NOT NULL UNIQUE,
    sort_order int DEFAULT 0
);

CREATE TABLE public."userTag"
(
    id SERIAL PRIMARY KEY,
    user_uid uuid REFERENCES public."user"(uid) ON DELETE CASCADE,
    tag_id int REFERENCES public."tag"(id) ON DELETE CASCADE
);
