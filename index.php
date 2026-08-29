<?php
// ============================================================================
// HOSTINGER WEB SERVER SPA ENTRY POINT & ROUTER
// ============================================================================

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$distPath = __DIR__ . '/dist';

// If requesting an asset inside dist/assets or dist/
$assetFile = $distPath . $uri;
if (is_file($assetFile)) {
    $ext = pathinfo($assetFile, PATHINFO_EXTENSION);
    $mimes = [
        'js' => 'application/javascript; charset=utf-8',
        'css' => 'text/css; charset=utf-8',
        'json' => 'application/json; charset=utf-8',
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'ico' => 'image/x-icon',
        'woff2' => 'font/woff2',
        'woff' => 'font/woff',
        'ttf' => 'font/ttf',
        'mp4' => 'video/mp4',
        'pdf' => 'application/pdf'
    ];
    if (isset($mimes[$ext])) {
        header('Content-Type: ' . $mimes[$ext]);
    }
    header('Cache-Control: public, max-age=31536000, immutable');
    readfile($assetFile);
    exit;
}

// SPA Fallback: Serve dist/index.html for all other routes
$indexPath = $distPath . '/index.html';
if (is_file($indexPath)) {
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    readfile($indexPath);
    exit;
}

// Fallback message if build artifact is missing
http_response_code(503);
echo "<!DOCTYPE html><html><head><title>Building Application</title></head><body style='font-family:sans-serif;text-align:center;padding:50px;background:#09090b;color:#fff;'>";
echo "<h1>VELAMETRIC Platform is initializing...</h1>";
echo "<p>Please ensure 'npm run build' has completed.</p>";
echo "</body></html>";
