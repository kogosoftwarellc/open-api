# Contributing to open-api

Thank you!  This project was started with one goal in mind: to provide 1st class
support for openapi in the node ecosystem.  It's usage is constantly growing.  With
growing usage comes more scrutiny and opportunities to improve.  If you've come here
with an issue: know that the maintainer[s] care deeply :heart:

## Submitting Pull Requests (PRs)

Each PR should adhere to the following standards:

1. It should be isolated to a single package.  This helps us draft meaningful CHANGELOGS from git history.
2. It should ideally have 1 commit, and each commit should be descriptive of what the change was e.g.

   ```
   git commit -m "Fixing an issue" # this is not descriptive
   ```

   ```
   git commit -m "openapi-response-validator: Allowing for requestBody to be parsed" # this is descriptive
   ```
   
   Using the commit script in `./bin/commit` is recommended.
   
   You can use `git commit --amend` to keep your PR isolated to a single commit when responding to feedback.
   If you prefer to commit frequently, then before opening a PR, use `git rebase` to squash all the commits into a single one.
3. It should support the official OpenAPI specification and not deviate from it.
4. If the PR fixes an Issue that was previously reported, the commit message should close the Issue using keywords in the commit message (see [Closing issues using keywords](https://help.github.com/articles/closing-issues-using-keywords/)) i.e.
   ```
   git commit -m "openapi-response-validator: Allowing for requestBody to be parsed (fixes #287)"
   ```

## Status of OpenAPI V3

_Note: this section was written on 2018-10-04 and may be out of date_

When this project began:
* OpenAPI had just formed.
* Swagger 2.0 was the sole version.
* OpenAPI V3 was just a dream on the horizon.

Since then we've seen the publishing of the V3 schema in a
[README](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md),
but not yet in a JSON Schema file.  See
https://github.com/OAI/OpenAPI-Specification/issues/1032.

If you're expecting to have fast resolution of issues relating to V3 then you'll have
to [open a Pull Request](https://github.com/kogosoftwarellc/open-api).  The reason for this is that the schema is still in flux and the Maintainer[s] must focus their time on reviewing and publishing code.

## Status of OpenAPI V2

V2 (fka swagger 2.0) is fully supported and extensively tested.

## The Maintainer's Pledge

> To respond swiftly, to deal justly...
