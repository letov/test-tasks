INSERT INTO public."user"
(email, password, nickname)
VALUES
    ('some1@mail.com', md5('pass1'), 'nickname1'),
    ('some2@mail.com', md5('pass2'), 'nickname2');

INSERT INTO public."tag"
(creator, name, sort_order)
VALUES
    ((SELECT uid FROM public."user" WHERE nickname = 'nickname1'), 'tagName11', 1),
    ((SELECT uid FROM public."user" WHERE nickname = 'nickname1'), 'tagName12', 1),
    ((SELECT uid FROM public."user" WHERE nickname = 'nickname1'), 'tagName13', 1),
    ((SELECT uid FROM public."user" WHERE nickname = 'nickname2'), 'tagName21', 2),
    ((SELECT uid FROM public."user" WHERE nickname = 'nickname2'), 'tagName22', 2);

INSERT INTO public."userTag"
(user_uid, tag_id)
VALUES
    ((SELECT uid FROM public."user" WHERE nickname = 'nickname1'), (SELECT id FROM public."tag" WHERE name = 'tagName1')),
    ((SELECT uid FROM public."user" WHERE nickname = 'nickname2'), (SELECT id FROM public."tag" WHERE name = 'tagName2'));
