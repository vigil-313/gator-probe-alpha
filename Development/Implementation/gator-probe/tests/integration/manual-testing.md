# VALUGATOR Probe Alpha - Manual Testing Checklist

## Overview
This document provides a structured approach to manually verify the full functionality of the VALUGATOR Probe Alpha. These tests complement the automated test suite and help identify issues that may not be captured by automated testing.

## Prerequisites
1. Node.js 18.0.0 or higher installed
2. All project dependencies installed (`npm install`)
3. All configuration files properly set up in the config directory

## Setup Instructions
1. Start the development server:
   ```
   npm run dev
   ```
2. Open a web browser and navigate to `http://localhost:3000`

## Test Cases

### 1. Initial Application Load

#### 1.1 Home Page Loading
- [ ] Verify the application loads without errors
- [ ] All UI elements are visible and properly styled
- [ ] Panel selection cards (Evaluation, Pathfinder, Legal) are displayed
- [ ] Title and introduction text are present
- Expected Result: Application loads with welcome screen and panel selection options

#### 1.2 Static Asset Loading
- [ ] CSS styles are properly applied
- [ ] JavaScript functionality is working
- [ ] Any icons or images load correctly
- Expected Result: All assets load without 404 errors and proper styling appears

### 2. Panel and Persona Selection

#### 2.1 Panel Selection
- [ ] Click on "Evaluation Chamber" panel card
- [ ] Verify the panel becomes highlighted/active
- [ ] Verify the persona dropdown populates with Evaluation personas
- [ ] Verify UI theme changes to green color scheme
- Expected Result: Panel becomes active, persona dropdown populates, UI theme updates

#### 2.2 Panel Switching
- [ ] Select "Pathfinder Council" panel
- [ ] Verify the panel becomes highlighted/active
- [ ] Verify the persona dropdown updates with Pathfinder personas
- [ ] Verify UI theme changes to purple color scheme
- [ ] Repeat for "Legal Panel" (should change to blue color scheme)
- Expected Result: Panel selection updates dropdown and theme accordingly

#### 2.3 Persona Selection
- [ ] Select a persona from the dropdown
- [ ] Verify the persona information appears
- [ ] Verify the persona avatar, name, and details are displayed
- Expected Result: Selected persona details appear with proper formatting

### 3. Idea Submission

#### 3.1 Form Validation
- [ ] Try submitting without selecting a panel
- [ ] Try submitting without selecting a persona
- [ ] Try submitting without entering an idea
- [ ] Try submitting with an idea that exceeds 2000 characters
- Expected Result: Appropriate validation error messages appear for each case

#### 3.2 Character Counter
- [ ] Enter text in the idea input field
- [ ] Verify the character counter updates correctly
- [ ] Verify counter turns yellow when approaching limit (>1500 chars)
- [ ] Verify counter turns red when near limit (>1800 chars)
- Expected Result: Counter updates correctly and changes color at thresholds

#### 3.3 Idea Submission - Simulation Mode
- [ ] Select a panel and persona
- [ ] Enter a valid startup idea
- [ ] Click "Submit Idea"
- [ ] Verify loading indicator appears
- [ ] Verify response appears after loading
- Expected Result: Loading indicator appears, then simulated response displays

### 4. Response Display

#### 4.1 Response Layout
- [ ] Verify the submitted idea appears in the response summary
- [ ] Verify the selected persona name and details appear
- [ ] Verify the gator response text is displayed
- [ ] Verify the panel name appears in the title
- Expected Result: All response elements display in proper layout

#### 4.2 Response Navigation
- [ ] Verify the "Start Over" button is present
- [ ] Click "Start Over" and verify return to input form
- [ ] Verify the "Technical Info" button works (if implemented)
- Expected Result: Buttons work and allow navigating back to input form

### 5. Error Handling

#### 5.1 Network Errors
- [ ] Disconnect internet (if using real API)
- [ ] Submit an idea
- [ ] Verify appropriate error message appears
- [ ] Verify "Try Again" button returns to form
- Expected Result: User-friendly error message appears with recovery option

#### 5.2 Server Errors
- [ ] If possible, simulate a 500 server error
- [ ] Verify appropriate error handling in UI
- Expected Result: Error state is properly shown to user

### 6. Responsiveness

#### 6.1 Mobile View
- [ ] Resize browser to mobile dimensions (or use device emulation)
- [ ] Verify all elements reflow correctly
- [ ] Verify all functionality works in mobile view
- Expected Result: Interface adapts to small screens and remains functional

#### 6.2 Tablet View
- [ ] Resize browser to tablet dimensions
- [ ] Verify all elements display correctly
- Expected Result: Interface adapts to medium screens properly

#### 6.3 Desktop View
- [ ] Verify full desktop layout works correctly
- Expected Result: Interface takes advantage of larger screen space

### 7. Real API Integration Tests (When Implemented)

#### 7.1 API Authentication
- [ ] Verify API requests include proper authentication
- [ ] Verify API key environment variables are properly used
- Expected Result: Authenticated requests succeed, missing auth fails appropriately

#### 7.2 Real API Response
- [ ] Submit an idea to the real API endpoint
- [ ] Verify actual LLM response is received and displayed
- Expected Result: Real API response displayed properly

### 8. Accessibility Testing

#### 8.1 Keyboard Navigation
- [ ] Navigate through the application using only keyboard
- [ ] Verify all interactive elements are reachable and usable
- Expected Result: Application is fully usable via keyboard

#### 8.2 Screen Reader Compatibility
- [ ] Test with a screen reader if available
- [ ] Verify all content is properly announced
- Expected Result: Content is accessible to screen readers

### 9. Performance Testing

#### 9.1 Load Time
- [ ] Measure initial page load time
- [ ] Verify load time is under 3 seconds
- Expected Result: Application loads quickly, even on slower connections

#### 9.2 Response Time
- [ ] Measure time from submission to response display
- [ ] Verify response time is reasonable (under 5 seconds for simulation, under 10 seconds for real API)
- Expected Result: Responses are generated within acceptable timeframes

### 10. Session and State Management

#### 10.1 Page Refresh
- [ ] Submit an idea and receive a response
- [ ] Refresh the page
- [ ] Verify application returns to initial state
- Expected Result: Application resets properly on page refresh

## Test Results

| Test Category | Pass/Fail | Notes/Issues |
|---------------|-----------|--------------|
| Initial Load  |           |              |
| Panel Selection |         |              |
| Idea Submission |         |              |
| Response Display |        |              |
| Error Handling |          |              |
| Responsiveness |          |              |
| API Integration |         |              |
| Accessibility |           |              |
| Performance |             |              |
| State Management |        |              |

## Issues Found

*List any issues discovered during manual testing here:*

1. 
2. 
3. 

## Recommendations

*Add recommendations for improvements based on testing results:*

1. 
2. 
3.

## Test Completion

**Tester Name:** _________________________

**Date:** _________________________

**Signature:** _________________________