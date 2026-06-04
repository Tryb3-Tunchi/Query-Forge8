Title: fix: sanitize imported JSON and validate query structure depth

Description:

- File size capped at 500KB before parsing
- Script tags stripped from imported content
- Structure validated: must have group type with children array
- Recursive depth check rejects structures deeper than 20 levels
- Descriptive error messages for each failure case
