<?php

// Edit these values after uploading the site to your hosting server.
// Keep this file on the server only if your repository is public.
const AGRIREVISE_DB_HOST = 'localhost';
const AGRIREVISE_DB_NAME = 'your_database_name';
const AGRIREVISE_DB_USER = 'your_database_user';
const AGRIREVISE_DB_PASS = 'your_database_password';
const AGRIREVISE_DB_CHARSET = 'utf8mb4';

function agrirevise_database_is_configured()
{
    return AGRIREVISE_DB_NAME !== 'your_database_name'
        && AGRIREVISE_DB_USER !== 'your_database_user';
}
