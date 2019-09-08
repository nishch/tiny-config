var expect = require("chai").expect;
process.env.NODE_ENV = "production";
process.env.NODE_CONFIG_PATH = "tests/testdata"
config = require("../lib/index");

describe("tiny-config", function () {
    describe("get", function () {
        it("invalid key is passed, should return undefined", function () {
            expect(config.get("random")).to.be.undefined;
        });

        it("partially valid nested key is passed, should return undefined", function () {
            expect(config.get("serviceConfig.retry.maxAttempts")).to.be.undefined;
        });

        it("valid key is passed", function () {
            expect(config.get("connectionString")).equals("prod_connection_string");
        });

        it("valid nested key is passed", function () {
            expect(config.get("serviceConfig.retryConfig.maxAttempts")).equals(5);
        });

        it("overrides same key if present in the env specific config", function () {
            expect(config.get("logLevel")).equals("error");
        });

        it("carries missing keys in the env specific config", function () {
            expect(config.get("author")).equals("Nishant Chaturvedi");
        });

        it("adds new keys in the env specific config", function () {
            expect(config.get("version")).equals("1.2.0");
        });

        it("if a value exists in env vars, that takes precedence", function () {
            process.env.version = "1.0.0"
            expect(config.get("version")).equals("1.0.0");
        });

        it("handles array values correctly", function () {
            const res = config.get("nestedArrayValue");
            const output = [
                "value1",
                "value2"
            ];
            expect(res).to.deep.equal(output);
        });
    });
});