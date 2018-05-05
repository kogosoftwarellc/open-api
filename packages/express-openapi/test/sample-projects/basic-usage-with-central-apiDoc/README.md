# Basic usage with central apiDoc

This test scenario illustrates the usage of `express-openapi` without operation
level apiDoc definitions. The setup and the test cases are identically to the [basic usage test](../basic-usage).

The only difference is a separation of [controller](api-routes) and openapi-spec logic.
The whole openapi doc is defined in [api-doc.yml](api-doc.yml).
