#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4014/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== KartPulse Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@velocitykarttrack.com","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
assert_status "Dashboard Stats" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/kart-fleet" -H "Authorization: Bearer $TOKEN")
assert_status "List Kart Fleet" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/race-sessions" -H "Authorization: Bearer $TOKEN")
assert_status "List Race Sessions" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/kart-maintenance" -H "Authorization: Bearer $TOKEN")
assert_status "List Kart Maintenance" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/track-maintenance" -H "Authorization: Bearer $TOKEN")
assert_status "List Track Maintenance" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/helmet-inventory" -H "Authorization: Bearer $TOKEN")
assert_status "List Helmet Inventory" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/rate-tiers" -H "Authorization: Bearer $TOKEN")
assert_status "List Rate Tiers" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/kart-track" -H "Authorization: Bearer $TOKEN")
assert_status "Kart Track Profile" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/kart-maintenance/urgent" -H "Authorization: Bearer $TOKEN")
assert_status "Urgent Kart Maintenance" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/helmet-inventory/available" -H "Authorization: Bearer $TOKEN")
assert_status "Available Helmets" 200 "$HTTP_CODE"

CREATE_KART=$(curl -s -w "\n%{http_code}" "$API_URL/kart-fleet" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Kart #99","section":"Test Pit","kartType":"standard","engineSpec":"9 HP"}')
HTTP_CODE=$(echo "$CREATE_KART" | tail -1)
assert_status "Create Kart" 201 "$HTTP_CODE"

KART_ID=$(echo "$CREATE_KART" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$KART_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/kart-fleet/$KART_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"maintenance"}')
  assert_status "Update Kart" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/kart-fleet/$KART_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Kart" 200 "$HTTP_CODE"
fi

CREATE_HELMET=$(curl -s -w "\n%{http_code}" "$API_URL/helmet-inventory" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Helmet","helmetType":"adult","size":"M","rentalPrice":4}')
HTTP_CODE=$(echo "$CREATE_HELMET" | tail -1)
assert_status "Create Helmet Item" 201 "$HTTP_CODE"

HELMET_ID=$(echo "$CREATE_HELMET" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$HELMET_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/helmet-inventory/$HELMET_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"rented"}')
  assert_status "Update Helmet Item" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/helmet-inventory/$HELMET_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Helmet Item" 200 "$HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats")
assert_status "Unauthorized Access" 401 "$HTTP_CODE"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
