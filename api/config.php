<?php

// Edit these values after uploading the site to your hosting server.
// Keep this file on the server only if your repository is public.
const AGRIREVISE_DB_HOST = 'localhost';
const AGRIREVISE_DB_NAME = 'u519103142_agrirevise';
const AGRIREVISE_DB_USER = 'u519103142_agrirevisedata';
const AGRIREVISE_DB_PASS = 'Agrirevise123!@#';
const AGRIREVISE_DB_CHARSET = 'utf8mb4';

function agrirevise_database_is_configured()
{
    return AGRIREVISE_DB_NAME !== 'u519103142_agrirevise'
        && AGRIREVISE_DB_USER !== 'u519103142_agrirevisedata';
}
