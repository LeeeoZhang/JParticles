import jsdom, {JSDOM} from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;