<?php
require 'vendor/autoload.php';

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
    $r->addRoute('GET', '/', 'pages/home.php');
    $r->addRoute('GET', '/home', 'pages/home.php');
    $r->addRoute('GET', '/forex', 'pages/forex.php');
    $r->addRoute('GET', '/forex-stock', 'pages/forex-stock.php');
    $r->addRoute('GET', '/forex-mutation', 'pages/forex-mutation.php');
    $r->addRoute('GET', '/order', 'pages/transaction/order.php');
    $r->addRoute('GET', '/order/edit', 'pages/transaction/order-edit.php');
    $r->addRoute('GET', '/branch', 'pages/branch.php');
    $r->addRoute('GET', '/contacts', 'pages/contacts.php');
    $r->addRoute('GET', '/account', 'pages/account.php');
    $r->addRoute('GET', '/fixed-asset', 'pages/coming-soon.php');
    $r->addRoute('GET', '/transaction', 'pages/transaction/transaction.php');
    $r->addRoute('GET', '/user-management', 'pages/setting/user-management.php');
    $r->addRoute('GET', '/settings', 'pages/setting/settings.php');
    $r->addRoute('GET', '/beginning-balance', 'pages/setting/beginning-balance.php');
    $r->addRoute('GET', '/profile', 'pages/setting/profile.php');
    $r->addRoute('GET', '/adjustment', 'pages/other-transaction/adjustment.php');
    $r->addRoute('GET', '/forex-transfer', 'pages/other-transaction/forex-transfer.php');
    $r->addRoute('GET', '/journal', 'pages/other-transaction/journal.php');
    $r->addRoute('GET', '/cash-transaction', 'pages/other-transaction/cash-transaction.php');

    // report
    $r->addRoute('GET', '/reports', 'pages/reports/reports.php');
    $r->addRoute('GET', '/bi-reports', 'pages/reports/bi-reports.php');
    $r->addRoute('GET', '/accounting-reports', 'pages/reports/accounting-reports.php');
    $r->addRoute('GET', '/other-reports', 'pages/reports/other-reports.php');
    $r->addRoute('GET', '/master-data-reports', 'pages/reports/masda-reports.php');
    $r->addRoute('GET', '/summary-valas', 'pages/reports/bi-reports/summary-valas.php');
    $r->addRoute('GET', '/lkub', 'pages/reports/bi-reports/lkub.php');
    $r->addRoute('GET', '/neraca', 'pages/reports/bi-reports/neraca.php');
    $r->addRoute('GET', '/laba-rugi', 'pages/reports/bi-reports/laba-rugi.php');
    $r->addRoute('GET', '/lkpe', 'pages/reports/bi-reports/lkpe.php');
    $r->addRoute('GET', '/ledger', 'pages/reports/accounting-reports/ledger.php');
    $r->addRoute('GET', '/logs-report', 'pages/reports/other-reports/logs-report.php');
    
});

return $dispatcher;
?>
