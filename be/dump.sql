--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: jagatteknologi; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA jagatteknologi;


ALTER SCHEMA jagatteknologi OWNER TO postgres;

--
-- Name: bulk_insert_number_phone(jsonb[]); Type: FUNCTION; Schema: jagatteknologi; Owner: postgres
--

CREATE FUNCTION jagatteknologi.bulk_insert_number_phone(params_array jsonb[]) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    params jsonb;
BEGIN
    -- Iterate over the array and insert each value
    FOREACH params IN ARRAY params_array
    LOOP
        -- Insert each number into the number_phone table
        INSERT INTO jagatteknologi.number_phone (number_phone)
        VALUES (params);
    END LOOP;

    RETURN true;
END;
$$;


ALTER FUNCTION jagatteknologi.bulk_insert_number_phone(params_array jsonb[]) OWNER TO postgres;

--
-- Name: delete_number_phone(jsonb); Type: FUNCTION; Schema: jagatteknologi; Owner: postgres
--

CREATE FUNCTION jagatteknologi.delete_number_phone(params jsonb) RETURNS boolean
    LANGUAGE plpgsql
    AS $$

BEGIN

    DELETE FROM jagatteknologi.number_phone
    WHERE id = (params->>'id')::UUID;

    RETURN FOUND; 
END;
$$;


ALTER FUNCTION jagatteknologi.delete_number_phone(params jsonb) OWNER TO postgres;

--
-- Name: get_all_numbers(jsonb); Type: FUNCTION; Schema: jagatteknologi; Owner: postgres
--

CREATE FUNCTION jagatteknologi.get_all_numbers(params jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', id,
                'numberPhone', number_phone
            )
        )
        FROM jagatteknologi.number_phone
    );
END;
$$;


ALTER FUNCTION jagatteknologi.get_all_numbers(params jsonb) OWNER TO postgres;

--
-- Name: insert_bulk_number_phone(jsonb); Type: FUNCTION; Schema: jagatteknologi; Owner: postgres
--

CREATE FUNCTION jagatteknologi.insert_bulk_number_phone(params jsonb) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    phone_number text;
    is_success boolean := true;
BEGIN
    FOR phone_number IN SELECT jsonb_array_elements_text(params->'numberPhone')
    LOOP
        BEGIN
            RAISE NOTICE 'Trying to insert phone number: %', phone_number;
            INSERT INTO jagatteknologi.number_phone (number_phone)
            VALUES (phone_number::VARCHAR);
        EXCEPTION
            WHEN unique_violation THEN
                -- Set is_success to false and terminate the loop
                RAISE NOTICE 'Unique violation for phone number: %', phone_number;
                is_success := false;
                EXIT;
        END;
    END LOOP;

    RETURN is_success;
END;
$$;


ALTER FUNCTION jagatteknologi.insert_bulk_number_phone(params jsonb) OWNER TO postgres;

--
-- Name: insert_number_phone(jsonb); Type: FUNCTION; Schema: jagatteknologi; Owner: postgres
--

CREATE FUNCTION jagatteknologi.insert_number_phone(params jsonb) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO jagatteknologi.number_phone (number_phone)
    VALUES ((params->>'numberPhone')); -- added ::int to cast to integer
    RETURN true;
END;
$$;


ALTER FUNCTION jagatteknologi.insert_number_phone(params jsonb) OWNER TO postgres;

--
-- Name: update_number_phone(jsonb); Type: FUNCTION; Schema: jagatteknologi; Owner: postgres
--

CREATE FUNCTION jagatteknologi.update_number_phone(params jsonb) RETURNS boolean
    LANGUAGE plpgsql
    AS $$

BEGIN

    UPDATE jagatteknologi.number_phone
    SET number_phone = (params->>'numberPhone')
    WHERE id = (params->>'id')::UUID;

    RETURN FOUND;  -- Return true if the record was found and updated, false otherwise
END;
$$;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

ALTER FUNCTION jagatteknologi.update_number_phone(params jsonb) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: number_phone; Type: TABLE; Schema: jagatteknologi; Owner: postgres
--

CREATE TABLE jagatteknologi.number_phone (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    number_phone character varying(20)
);


ALTER TABLE jagatteknologi.number_phone OWNER TO postgres;

--
-- Name: number_phone number_phone_number_phone_key; Type: CONSTRAINT; Schema: jagatteknologi; Owner: postgres
--

ALTER TABLE ONLY jagatteknologi.number_phone
    ADD CONSTRAINT number_phone_number_phone_key UNIQUE (number_phone);


--
-- Name: number_phone number_phone_pkey; Type: CONSTRAINT; Schema: jagatteknologi; Owner: postgres
--

ALTER TABLE ONLY jagatteknologi.number_phone
    ADD CONSTRAINT number_phone_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

