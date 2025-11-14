# Implementation Tasks: Add File Upload and Validation

## 1. Dependencies Installation
- [x] 1.1 Install ajv library: `npm install ajv`
- [x] 1.2 Install ajv-formats: `npm install ajv-formats`
- [x] 1.3 Verify erdv_file_spec.json is in public or accessible location

## 2. State Management Module
- [x] 2.1 Create `src/state.ts` file
- [x] 2.2 Define AppState interface (model, fileName, uploadedAt, validationErrors)
- [x] 2.3 Implement getModel(), setModel(), clearModel() functions
- [x] 2.4 Implement getMetadata() to extract summary from model
- [x] 2.5 Add JSDoc comments for all exported functions

## 3. Validation Module
- [x] 3.1 Create `src/validation.ts` file
- [x] 3.2 Import ajv and ajv-formats
- [x] 3.3 Implement initValidator() to load erdv_file_spec.json and setup ajv
- [x] 3.4 Implement validateModel(data) function
- [x] 3.5 Implement formatErrors(ajvErrors) to convert ajv errors to user-friendly messages
- [x] 3.6 Handle schema loading errors gracefully
- [x] 3.7 Add JSDoc comments for all exported functions

## 4. File Upload Module
- [x] 4.1 Create `src/fileUpload.ts` file
- [x] 4.2 Implement initFileUpload() to setup event listeners
- [x] 4.3 Implement handleFileDrop(event) for drag-and-drop
- [x] 4.4 Implement handleFileSelect(event) for button click
- [x] 4.5 Implement readFile(file) using FileReader API
- [x] 4.6 Implement displayMetadata(model) to show success state
- [x] 4.7 Implement displayErrors(errors) to show validation errors
- [x] 4.8 Implement clearUploadState() to reset UI
- [x] 4.9 Add file type validation (.erdv, .json only)
- [x] 4.10 Add loading indicator during processing
- [x] 4.11 Add JSDoc comments for all exported functions

## 5. HTML Structure Updates
- [x] 5.1 Update upload section in `index.html` with drag-drop zone
- [x] 5.2 Add file input element (hidden)
- [x] 5.3 Add "Select File" button
- [x] 5.4 Add success state elements (hidden by default)
- [x] 5.5 Add error state elements (hidden by default)
- [x] 5.6 Add loading indicator element
- [x] 5.7 Add metadata display fields (model name, database, counts)
- [x] 5.8 Add "Upload Different File" and "Try Again" buttons

## 6. CSS Styling Updates
- [x] 6.1 Update `src/styles.css` for upload zone (drag-over state)
- [x] 6.2 Style success state display
- [x] 6.3 Style error state display with scrollable error list
- [x] 6.4 Style loading indicator
- [x] 6.5 Style metadata display
- [x] 6.6 Style buttons (primary, secondary)
- [x] 6.7 Add transitions for state changes
- [x] 6.8 Ensure responsive design for all upload states

## 7. Main Application Integration
- [x] 7.1 Update `src/main.ts` to import and initialize file upload
- [x] 7.2 Call initValidator() on app startup
- [x] 7.3 Call initFileUpload() after DOM is loaded
- [x] 7.4 Handle validator initialization errors
- [x] 7.5 Update browser compatibility check to include File API

## 8. Error Handling
- [x] 8.1 Handle JSON parsing errors with clear messages
- [x] 8.2 Handle file reading errors (permissions, corruption)
- [x] 8.3 Handle schema loading failures
- [x] 8.4 Handle large file warnings (>10MB)
- [x] 8.5 Handle invalid file types
- [x] 8.6 Add try-catch blocks around all file operations
- [x] 8.7 Log detailed errors to console for debugging

## 9. User Experience Polish
- [x] 9.1 Add hover effects to upload zone
- [x] 9.2 Add visual feedback during drag-over
- [x] 9.3 Add smooth transitions between states
- [x] 9.4 Ensure all text is readable and properly sized
- [x] 9.5 Test keyboard navigation (tab through buttons)
- [x] 9.6 Add ARIA labels for accessibility
- [ ] 9.7 Test with screen reader (basic check) - Deferred to user testing

## 10. Testing and Validation
- [x] 10.1 Test with valid .erdv file (data_model_example.yaml converted to JSON)
- [x] 10.2 Test with invalid JSON syntax
- [x] 10.3 Test with JSON missing required fields
- [x] 10.4 Test with JSON having wrong data types
- [x] 10.5 Test with JSON having pattern mismatches (invalid identifiers)
- [x] 10.6 Test drag-and-drop functionality
- [x] 10.7 Test file selection button
- [x] 10.8 Test uploading new file while one is loaded
- [x] 10.9 Test "Upload Different File" button
- [ ] 10.10 Test with large file (100+ entities) - Deferred to user testing
- [x] 10.11 Verify metadata display is accurate
- [x] 10.12 Verify error messages are clear and helpful
- [ ] 10.13 Test in Chrome, Firefox, Safari, Edge - Core functionality tested in Chrome
- [x] 10.14 Verify no console errors on success path
- [x] 10.15 Verify errors are logged on failure path

## 11. Documentation
- [x] 11.1 Update README.md with file upload instructions
- [x] 11.2 Add example .erdv file to repository or document where to get one
- [x] 11.3 Document common validation errors and solutions
- [x] 11.4 Add JSDoc comments throughout code
- [x] 11.5 Update ROADMAP.md to mark Phase 1 complete

## 12. Final Validation
- [x] 12.1 Review code against design.md architecture
- [x] 12.2 Verify all requirements in spec.md are satisfied
- [x] 12.3 Run `npm run build` and verify no errors
- [x] 12.4 Run `npm run dev` and test full workflow
- [x] 12.5 Check bundle size (ajv adds ~60KB gzipped) - 135.94 KB total, 42.83 KB gzipped
- [x] 12.6 Verify TypeScript strict mode passes
- [x] 12.7 Clean up any debug console.logs
- [x] 12.8 Verify no linting errors

## Dependencies Between Tasks
- Tasks 1-2 can run in parallel (dependencies, state)
- Task 3 (validation) depends on task 1 (dependencies)
- Task 4 (file upload) depends on tasks 2-3 (state, validation)
- Tasks 5-6 (HTML, CSS) can run in parallel with task 4
- Task 7 (integration) depends on tasks 3-4 being complete
- Task 8 (error handling) is integrated throughout tasks 3-4, 7
- Tasks 9-10 (UX, testing) depend on all previous tasks
- Tasks 11-12 (docs, validation) must be last

## Parallelizable Work
- Dependencies installation (task 1) can start immediately
- State module (task 2) can be done while dependencies install
- HTML updates (task 5) and CSS updates (task 6) can be done in parallel
- Documentation (task 11) can be written alongside implementation
