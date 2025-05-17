/**
 * @file layout.js
 * @description Loads shared layout components navbar and footer.
 */

// Import layout components
import { loadNavbar } from '../../components/navbar.js';
import { loadFooter } from '../../components/footer.js';

/**
 * Load the navigation bar and insert it into the DOM.
 */
loadNavbar();

/**
 * Load the footer and insert it into the DOM.
 */
loadFooter();
