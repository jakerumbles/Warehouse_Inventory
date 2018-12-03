--
-- PostgreSQL database dump
--

-- Dumped from database version 10.6 (Ubuntu 10.6-1.pgdg14.04+1)
-- Dumped by pg_dump version 10.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: hsyfhnwfejbulk
--

INSERT INTO public.inventory (inv_id, description, category, date_recieved, storage_location, quantity, remove, available) VALUES (2, 'Stripper Leg Light', 'Lights', '2018-12-02', '1234', 1, false, 1);
INSERT INTO public.inventory (inv_id, description, category, date_recieved, storage_location, quantity, remove, available) VALUES (3, 'Kitchen Table', 'Tables', '2018-12-02', '0002', 3, false, 2);
INSERT INTO public.inventory (inv_id, description, category, date_recieved, storage_location, quantity, remove, available) VALUES (4, 'Patio chair', 'Furniture', '2018-12-02', '0013', 3, false, 3);
INSERT INTO public.inventory (inv_id, description, category, date_recieved, storage_location, quantity, remove, available) VALUES (1, 'Rustic Table', 'Table', '2018-12-01', '4', 3, false, 0);
INSERT INTO public.inventory (inv_id, description, category, date_recieved, storage_location, quantity, remove, available) VALUES (5, 'Hammer', 'Tools', '2018-12-03', '0009', 19, false, 9);
INSERT INTO public.inventory (inv_id, description, category, date_recieved, storage_location, quantity, remove, available) VALUES (6, 'Nails', 'Tools', '2018-12-03', '0009', 25, false, 5);
INSERT INTO public.inventory (inv_id, description, category, date_recieved, storage_location, quantity, remove, available) VALUES (7, 'Desk Chair', 'Furniture', '2018-12-03', '0008', 8, false, 8);


--
-- Data for Name: inventory_history; Type: TABLE DATA; Schema: public; Owner: hsyfhnwfejbulk
--

INSERT INTO public.inventory_history (hist_id, inv_id, description, category, quantity, date_modified, storage_location, history) VALUES (1, 1, 'Rustic Table', 'Table', 3, '2018-12-01', '4', 'fred@fred.com created item.');
INSERT INTO public.inventory_history (hist_id, inv_id, description, category, quantity, date_modified, storage_location, history) VALUES (2, 2, 'Stripper Leg Light', 'Lights', 1, '2018-12-02', '1234', 'edwardsjake@live.com created item.');
INSERT INTO public.inventory_history (hist_id, inv_id, description, category, quantity, date_modified, storage_location, history) VALUES (3, 3, 'Kitchen Table', 'Tables', 2, '2018-12-02', '0002', 'edwardsjake@live.com created item.');
INSERT INTO public.inventory_history (hist_id, inv_id, description, category, quantity, date_modified, storage_location, history) VALUES (4, 3, 'Kitchen Table', 'Tables', 3, '2018-12-02', '0002', 'edwardsjake@live.com modified item.');
INSERT INTO public.inventory_history (hist_id, inv_id, description, category, quantity, date_modified, storage_location, history) VALUES (5, 4, 'Patio chair', 'Furniture', 2, '2018-12-02', '0012', 'rand@rand.com created item.');
INSERT INTO public.inventory_history (hist_id, inv_id, description, category, quantity, date_modified, storage_location, history) VALUES (6, 4, 'Patio chair', 'Furniture', 3, '2018-12-02', '0013', 'rand@rand.com modified item.');
INSERT INTO public.inventory_history (hist_id, inv_id, description, category, quantity, date_modified, storage_location, history) VALUES (7, 5, 'Hammer', 'Tools', 19, '2018-12-03', '0009', 'daloach20@gmail.com created item.');
INSERT INTO public.inventory_history (hist_id, inv_id, description, category, quantity, date_modified, storage_location, history) VALUES (8, 6, 'Nails', 'Tools', 25, '2018-12-03', '0009', 'daloach20@gmail.com created item.');
INSERT INTO public.inventory_history (hist_id, inv_id, description, category, quantity, date_modified, storage_location, history) VALUES (9, 7, 'Desk Chair', 'Furniture', 6, '2018-12-03', '0008', 'daloach20@gmail.com created item.');
INSERT INTO public.inventory_history (hist_id, inv_id, description, category, quantity, date_modified, storage_location, history) VALUES (10, 7, 'Desk Chair', 'Furniture', 8, '2018-12-03', '0008', 'daloach20@gmail.com modified item.');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: hsyfhnwfejbulk
--

INSERT INTO public.users (id, firstname, lastname, email, password, access, date_created) VALUES ('265ec291-6504-4a80-80d6-9421258bfe5a', 'Fred', 'Fred', 'fred@fred.com', '$2a$10$d0A4KdIpVJ3MzYlnYGoL0uvA5v0AAfhhhkMmFxWhVB61hpMkJhBuq', 0, '2018-12-01');
INSERT INTO public.users (id, firstname, lastname, email, password, access, date_created) VALUES ('059d2cb8-fc26-42e1-afb8-1f4cff4cdedb', 'test', 'test', 'test@test.com', '$2a$10$CNioVt6kxaPBQqtS4Exf6.w/Jdz0/obPc2NRUFah8OjETxPmp4uCK', 4, '2018-12-02');
INSERT INTO public.users (id, firstname, lastname, email, password, access, date_created) VALUES ('123f7ce9-8d6a-4083-b760-5a5233cd2c78', 'rand', 'rand', 'rand@rand.com', '$2a$10$gtzBb4ilGXOchGqzIuccLeUA5abOI/FxhUa15TE0UORZ4gGoerPbu', 3, '2018-12-02');
INSERT INTO public.users (id, firstname, lastname, email, password, access, date_created) VALUES ('cfabdead-c90d-4bdc-a3b7-d7fdbdb6a248', 'Bob', 'Saget', 'aurionofficialyo@gmail.com', '$2a$10$y.eKsIOq5V5vpqphV/MBjeO9fBzNEsRtUuJMo92.MSQywotiGpuuS', 2, '2018-12-02');
INSERT INTO public.users (id, firstname, lastname, email, password, access, date_created) VALUES ('fd6d9866-4613-4ca5-80ab-3b7cf8271fa6', 'Jake', 'Edwards', 'edwardsjake@live.com', '$2a$10$RKpcYD4Yfv3ZUJUzgvRA0e8c2RJW/aOqp96.u8EwLOKd09guTwtme', 2, '2018-12-02');
INSERT INTO public.users (id, firstname, lastname, email, password, access, date_created) VALUES ('6c27e32f-f394-4884-84cb-649bf081c7b9', 'David', 'Hamilton', 'daloach20@gmail.com', '$2a$10$xH9bDnDAGpTRLrdOVkUSMOHA3LJ2mhnNY007Nl7J7wZLI6XJBycxS', 2, '2018-12-02');
INSERT INTO public.users (id, firstname, lastname, email, password, access, date_created) VALUES ('82048146-0d59-44c5-8337-64abb3bbe182', 'John', 'Johnny', 'xxroguexx911@gmail.com', '$2a$10$kABOeSnb62i54ZpX19Pvy.1Nj3lQr/Ggs8uywX8tlyBGRt8Dis00q', 4, '2018-12-03');


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: hsyfhnwfejbulk
--

INSERT INTO public.project (proj_id, manager_id, name) VALUES (1, '265ec291-6504-4a80-80d6-9421258bfe5a', 'Test Project 1');
INSERT INTO public.project (proj_id, manager_id, name) VALUES (2, 'fd6d9866-4613-4ca5-80ab-3b7cf8271fa6', 'Jake''s Project');
INSERT INTO public.project (proj_id, manager_id, name) VALUES (3, 'cfabdead-c90d-4bdc-a3b7-d7fdbdb6a248', 'Bob Sage''s Project');
INSERT INTO public.project (proj_id, manager_id, name) VALUES (4, 'fd6d9866-4613-4ca5-80ab-3b7cf8271fa6', 'Jake''s 2nd proj');
INSERT INTO public.project (proj_id, manager_id, name) VALUES (5, '6c27e32f-f394-4884-84cb-649bf081c7b9', 'David''s Test Project 1');
INSERT INTO public.project (proj_id, manager_id, name) VALUES (7, '6c27e32f-f394-4884-84cb-649bf081c7b9', 'John''s Building Project');
INSERT INTO public.project (proj_id, manager_id, name) VALUES (6, '82048146-0d59-44c5-8337-64abb3bbe182', 'John''s Building Project');


--
-- Data for Name: project_items; Type: TABLE DATA; Schema: public; Owner: hsyfhnwfejbulk
--

INSERT INTO public.project_items (proj_id, inv_id, reserved) VALUES (1, 1, 1);
INSERT INTO public.project_items (proj_id, inv_id, reserved) VALUES (2, 3, 1);
INSERT INTO public.project_items (proj_id, inv_id, reserved) VALUES (3, 1, 1);
INSERT INTO public.project_items (proj_id, inv_id, reserved) VALUES (5, 1, 1);
INSERT INTO public.project_items (proj_id, inv_id, reserved) VALUES (7, 5, 10);
INSERT INTO public.project_items (proj_id, inv_id, reserved) VALUES (7, 6, 20);


--
-- Name: inventory_history_hist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hsyfhnwfejbulk
--

SELECT pg_catalog.setval('public.inventory_history_hist_id_seq', 10, true);


--
-- Name: inventory_inv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hsyfhnwfejbulk
--

SELECT pg_catalog.setval('public.inventory_inv_id_seq', 7, true);


--
-- Name: project_proj_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hsyfhnwfejbulk
--

SELECT pg_catalog.setval('public.project_proj_id_seq', 7, true);


--
-- PostgreSQL database dump complete
--

