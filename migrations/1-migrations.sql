CREATE TABLE public."user"
(
    uid uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    nickname VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE public."tag"
(
    id SERIAL PRIMARY KEY,
    creator uuid REFERENCES public."user"(uid) ON DELETE CASCADE,
    name VARCHAR(40) NOT NULL,
    sortOrder int DEFAULT 0
);

