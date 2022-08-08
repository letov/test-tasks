INSERT INTO public."user"
(email, password, nickname)
VALUES
    ('some1@mail.com', md5('pass1'), 'nickname1'),
    ('some2@mail.com', md5('pass2'), 'nickname2');

INSERT INTO public."tag"
(creator, name, sortOrder)
VALUES
    ((SELECT uid FROM public."user" WHERE nickname = 'nickname1'), 'tagName1', 1),
    ((SELECT uid FROM public."user" WHERE nickname = 'nickname2'), 'tagName2', 2);