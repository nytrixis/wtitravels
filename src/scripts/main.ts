import { captureAttribution, initAutoTracking, initLoaders } from './telemetry';
import { initLeadForms } from './forms';
import { initMotion } from './motion';

captureAttribution();
initLoaders();
initAutoTracking();
initLeadForms();
initMotion();
