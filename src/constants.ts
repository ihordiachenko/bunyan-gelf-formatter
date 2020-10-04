/**
 * Syslog severity levels according to RFC-5424
 *
 * @link https://tools.ietf.org/html/rfc5424#section-6.2.1
 */
export enum SYSLOG_LEVELS {
  /**
   * System is unusable	A panic condition
   */
  EMERGENCY = 0,

  /**
   * Action must be taken immediately
   * A condition that should be corrected immediately, such as a corrupted system database.
   */
  ALERT = 1,

  /**
   * Critical conditions. Hard device errors.
   */
  CRITICAL = 2,

  /**
   * Error conditions.
   */
  ERROR = 3,

  /**
   * Warning conditions.
   */
  WARNING = 4,

  /**
   * Normal but significant conditions.
   * Conditions that are not error conditions, but that may require special handling.
   */
  NOTICE = 5,

  /**
   * Informational messages.
   */
  INFO = 6,

  /**
   * Debug messages.
   */
  DEBUG = 7,
}
