Overview
I need to implement automated tests to ensure that Storybook correctly generates stories, selects assets based on scene descriptions, and maintains overall quality. These tests will interact with our live API endpoints instead of using mock data, as I want to evaluate the LLM’s real responses.

Our primary testing objectives are:

Verify story generation accuracy – Ensuring that inputs like character name, sidekick, and setting appear correctly in the generated text.
Validate asset selection – Confirming that illustrations match the scene descriptions using our asset-matching logic.
Monitor overall quality – Making sure the generated stories follow a logical structure and contain appropriate content.

1. Set Up the Testing Environment
Install the necessary testing dependencies, including a test framework, HTTP request library, and fetch polyfill.
Configure the testing environment to use Node.js since we are testing API routes, not UI components.
Ensure that fetch is properly supported in the test environment to avoid failures.
2. Set Up a Local Test Server
Since we are testing real API responses, we need to start a local Next.js test server before running the tests.
This server should listen on a dedicated test port to prevent conflicts with the development environment.
The test server will initialize our Next.js app and handle API requests during testing.
After tests complete, the server should shut down to free resources.

3. Test Story Generation (LLM API)
Create a test that sends a request to the /api/story endpoint with a predefined input.
The test should check that:
The character’s name appears in the story title, subtitle, and text.
The story contains at least the requested number of pages.
Each page has non-empty text and an image description.
The generated story aligns with the expected structure (e.g., introduction, challenge, resolution).
The test should allow enough time for the LLM to respond.

4. Test Asset Selection (Compose Image API)
Create a test that sends a scene description to the /api/compose-image endpoint.
The test should verify that:
The selected pose matches the described emotion or action.
The selected background corresponds to the described setting.
The background and pose have sufficient matching scores to ensure a good selection.
This test will help validate whether our asset selection logic is functioning correctly.

5. Run the Tests
Execute the test suite to ensure that all API responses meet expectations.
If tests fail due to timeouts, increase the execution time to allow for AI processing.
Ensure that all required local services (Ollama, DrawThings) are running before testing.

6. Debugging and Common Issues
Absolute URL Issues: If tests fail due to missing absolute URLs, ensure that all API calls explicitly specify http://localhost:PORT.
Fetch Not Found: If Jest complains about missing fetch, verify that the test environment includes a fetch polyfill.
LLM API Timeouts: If story generation takes too long, increase the test timeout threshold.
Test Server Not Starting: If the Next.js test server doesn’t start, confirm that it is correctly initialized before test execution.