Title: feat: recursive query engine, parser, and validation engine

Description:
- queryEngine.ts: evaluates AND/OR groups recursively against datasets
- queryParser.ts: generates SQL, MongoDB, and JSON output formats
- queryValidator.ts: validates operator/type compatibility and value rules
- All 19 operators implemented including regex, null checks, date ranges