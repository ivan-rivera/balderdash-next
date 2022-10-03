/**
 * What users see when the state is in the "dasher" state
 */

import cookieCutter from "cookie-cutter";


/**
 * Component that users see when they are the dasher
 */
function DasherView() {
}


/**
 * Component that users see when they are not the dasher
 */
function GuesserView() {
}

export default function DasherState({dasher}) {
    return cookieCutter.get('username') === dasher ? DasherView() : GuesserView()
}