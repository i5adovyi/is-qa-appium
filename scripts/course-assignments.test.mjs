import { test } from 'node:test'
import assert from 'node:assert/strict'
import { findAssignments } from '../course/assignments.js'

const catalog = {
    assignmentTopics: [
        { id: 'locators', title: 'Locators and screen objects' },
        { id: 'commerce', title: 'Commerce and checkout' },
    ],
    assignmentLevels: [
        { id: 'L1', title: 'L1 · Focused task' },
        { id: 'L2', title: 'L2 · Investigation' },
        { id: 'L3', title: 'L3 · Team decision' },
    ],
    assignmentEnvironments: [
        { id: 'offline', title: 'Offline · Node only' },
        { id: 'android', title: 'Android device' },
        { id: 'design', title: 'Design review · no device needed' },
    ],
    assignments: [
        { id: 'AS-01', title: 'Inspect the right control', topic: 'locators', level: 'L1', environment: 'android',
            summary: 'Locate the username input with evidence.', app: 'WebdriverIO demo', duration: '30–45 min',
            prerequisites: ['Lesson 05', 'Appium Inspector'], deliverable: 'Selector inventory' },
        { id: 'AS-02', title: 'Repair a stale reference', topic: 'locators', level: 'L2', environment: 'offline',
            summary: 'Observe changing elements using fresh reads.', app: 'Synthetic Node fixture', duration: '45–60 min',
            prerequisites: ['Lab 13', 'await and assertions'], deliverable: 'Repair and regression evidence' },
        { id: 'AS-03', title: 'Choose the checkout coverage', topic: 'commerce', level: 'L3', environment: 'design',
            summary: 'Propose an affordable release gate.', app: 'My Demo App', duration: '60–90 min',
            prerequisites: ['Risk and test design'], deliverable: 'Release decision memo' },
    ],
}

test('assignment search combines words across title, app, prerequisites and visible labels', () => {
    assert.deepEqual(findAssignments(catalog, { query: '  INSPECTOR   android ' }).map(item => item.id), ['AS-01'])
    assert.deepEqual(findAssignments(catalog, { query: 'L2 node stale' }).map(item => item.id), ['AS-02'])
    assert.deepEqual(findAssignments(catalog, { query: 'team checkout memo' }).map(item => item.id), ['AS-03'])
    assert.deepEqual(findAssignments(catalog, { query: 'AS-02' }).map(item => item.id), ['AS-02'])
})

test('topic, complexity and environment filters intersect rather than replacing each other', () => {
    assert.deepEqual(findAssignments(catalog, { topic: 'locators' }).map(item => item.id), ['AS-01', 'AS-02'])
    assert.deepEqual(findAssignments(catalog, { topic: 'locators', level: 'L2', environment: 'offline' }).map(item => item.id), ['AS-02'])
    assert.deepEqual(findAssignments(catalog, { topic: 'locators', level: 'L2', environment: 'android' }), [])
    assert.deepEqual(findAssignments(catalog, { query: 'stale', topic: 'commerce' }), [])
    assert.deepEqual(findAssignments(catalog, { environment: 'unknown' }), [])
})

test('blank filters expose the full bank in catalog order without changing assignment or progress data', () => {
    const withProgress = { ...structuredClone(catalog), completed: ['00', 'CH-01'], notes: { 'CH-01': 'Personal evidence' } }
    const before = structuredClone(withProgress)
    assert.deepEqual(findAssignments(withProgress).map(item => item.id), ['AS-01', 'AS-02', 'AS-03'])
    assert.deepEqual(findAssignments(withProgress, { query: '   ', topic: 'all', level: 'all', environment: 'all' }).map(item => item.id), ['AS-01', 'AS-02', 'AS-03'])
    findAssignments(withProgress, { topic: 'commerce', query: 'release' })
    assert.deepEqual(withProgress, before)
    assert.deepEqual(findAssignments({}), [])
})
