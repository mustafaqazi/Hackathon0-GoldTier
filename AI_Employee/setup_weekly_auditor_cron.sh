#!/bin/bash
###############################################################################
# Weekly Auditor Cron Setup Script
# Configures automated weekly audits at specified time
# Usage: bash setup_weekly_auditor_cron.sh [--day DAY] [--time TIME] [--remove]
###############################################################################

set -e

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUDITOR_SCRIPT="${PROJECT_DIR}/skills/weekly_auditor.js"
LOG_DIR="${PROJECT_DIR}/vault/Logs"
CRON_LOG="${LOG_DIR}/weekly_auditor_cron.log"
CRON_JOB_NAME="WeeklyAuditor"

# Defaults
DAY="MON"  # Monday (0=Sunday, 1=Monday, ..., 6=Saturday)
TIME="09:00"  # 9 AM
REMOVE=false

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

###############################################################################
# Functions
###############################################################################

print_usage() {
  cat << 'EOF'
Usage: bash setup_weekly_auditor_cron.sh [OPTIONS]

Options:
  --day DAY          Day of week (MON, TUE, WED, THU, FRI, SAT, SUN) [default: MON]
  --time TIME        Time in 24-hour format HH:MM [default: 09:00]
  --remove           Remove the cron job
  --help             Show this help message

Examples:
  # Setup to run Monday at 9 AM (default)
  bash setup_weekly_auditor_cron.sh

  # Setup to run Friday at 6 PM
  bash setup_weekly_auditor_cron.sh --day FRI --time 18:00

  # Remove the cron job
  bash setup_weekly_auditor_cron.sh --remove
EOF
}

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[OK]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

###############################################################################
# Parse Arguments
###############################################################################

while [[ $# -gt 0 ]]; do
  case $1 in
    --day)
      DAY="${2^^}"  # Convert to uppercase
      shift 2
      ;;
    --time)
      TIME="$2"
      shift 2
      ;;
    --remove)
      REMOVE=true
      shift
      ;;
    --help)
      print_usage
      exit 0
      ;;
    *)
      log_error "Unknown option: $1"
      print_usage
      exit 1
      ;;
  esac
done

###############################################################################
# Validate Configuration
###############################################################################

log_info "Validating configuration..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  log_error "Node.js is not installed"
  exit 1
fi

# Check if auditor script exists
if [ ! -f "$AUDITOR_SCRIPT" ]; then
  log_error "Auditor script not found: $AUDITOR_SCRIPT"
  exit 1
fi

# Validate day of week
case "$DAY" in
  MON|TUE|WED|THU|FRI|SAT|SUN)
    ;;
  *)
    log_error "Invalid day: $DAY"
    echo "Valid days: MON, TUE, WED, THU, FRI, SAT, SUN"
    exit 1
    ;;
esac

# Validate time format
if ! [[ "$TIME" =~ ^[0-2][0-9]:[0-5][0-9]$ ]]; then
  log_error "Invalid time format: $TIME"
  echo "Use 24-hour format: HH:MM (e.g., 09:00, 18:30)"
  exit 1
fi

log_success "Configuration validated"

###############################################################################
# Utility Functions
###############################################################################

# Convert day name to cron format
get_day_number() {
  case "$1" in
    SUN) echo 0 ;;
    MON) echo 1 ;;
    TUE) echo 2 ;;
    WED) echo 3 ;;
    THU) echo 4 ;;
    FRI) echo 5 ;;
    SAT) echo 6 ;;
  esac
}

# Extract hour and minute
get_hour() {
  echo "$1" | cut -d: -f1
}

get_minute() {
  echo "$1" | cut -d: -f2
}

# Generate cron expression
# Cron format: minute hour day-of-month month day-of-week
generate_cron_expression() {
  local minute=$(get_minute "$TIME")
  local hour=$(get_hour "$TIME")
  local day=$(get_day_number "$DAY")

  echo "$minute $hour * * $day"
}

###############################################################################
# Setup/Remove Cron Job
###############################################################################

if [ "$REMOVE" = true ]; then
  log_info "Removing cron job..."

  if crontab -l 2>/dev/null | grep -q "$CRON_JOB_NAME"; then
    # Remove the cron job
    crontab -l | grep -v "$CRON_JOB_NAME" | crontab -
    log_success "Cron job removed successfully"
  else
    log_warn "Cron job not found"
  fi

  exit 0
fi

###############################################################################
# Create Log Directory
###############################################################################

mkdir -p "$LOG_DIR"
log_success "Log directory ready: $LOG_DIR"

###############################################################################
# Generate Cron Job
###############################################################################

log_info "Generating cron job..."

CRON_EXPRESSION=$(generate_cron_expression)
CRON_COMMAND="cd $PROJECT_DIR && node $AUDITOR_SCRIPT >> $CRON_LOG 2>&1"
CRON_ENTRY="# WeeklyAuditor Job
$CRON_EXPRESSION $CRON_COMMAND"

log_info "Cron Expression: $CRON_EXPRESSION"
log_info "Schedule: $DAY at $TIME"

###############################################################################
# Install Cron Job
###############################################################################

log_info "Installing cron job..."

# Get current crontab (if exists)
CURRENT_CRONTAB=$(crontab -l 2>/dev/null || echo "")

# Check if job already exists
if echo "$CURRENT_CRONTAB" | grep -q "$CRON_JOB_NAME"; then
  log_warn "Cron job already exists. Updating..."
  # Remove old job
  echo "$CURRENT_CRONTAB" | grep -v "$CRON_JOB_NAME" | crontab -
  CURRENT_CRONTAB=$(crontab -l 2>/dev/null || echo "")
fi

# Add new job
if [ -z "$CURRENT_CRONTAB" ]; then
  echo "$CRON_ENTRY" | crontab -
else
  echo "$CURRENT_CRONTAB" | (cat; echo ""; echo "$CRON_ENTRY") | crontab -
fi

log_success "Cron job installed successfully"

###############################################################################
# Verification
###############################################################################

log_info "Verifying installation..."

if crontab -l | grep -q "$CRON_JOB_NAME"; then
  log_success "Cron job verified"
else
  log_error "Cron job verification failed"
  exit 1
fi

###############################################################################
# Display Summary
###############################################################################

echo ""
echo "================================================================================"
echo "✅ WEEKLY AUDITOR CRON JOB INSTALLED"
echo "================================================================================"
echo ""
echo "Configuration:"
echo "  Project Directory: $PROJECT_DIR"
echo "  Auditor Script:    $AUDITOR_SCRIPT"
echo "  Schedule:          $DAY at $TIME"
echo "  Cron Expression:   $CRON_EXPRESSION"
echo "  Log File:          $CRON_LOG"
echo ""
echo "Current Crontab:"
echo "---"
crontab -l | grep -A 1 "$CRON_JOB_NAME" || echo "No cron jobs found"
echo "---"
echo ""
echo "To view the full crontab:"
echo "  crontab -l"
echo ""
echo "To edit the cron job:"
echo "  crontab -e"
echo ""
echo "To remove the cron job:"
echo "  bash setup_weekly_auditor_cron.sh --remove"
echo ""
echo "To view audit logs:"
echo "  tail -f $CRON_LOG"
echo ""
echo "================================================================================"

exit 0
