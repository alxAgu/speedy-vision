/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * fps-counter.js
 * A FPS counter
 */

import { IllegalOperationError } from './errors';

/** @const {number} update interval in milliseconds */
const UPDATE_INTERVAL = 500;

/** @type {FPSCounter|null} Singleton */
let instance = null;

/**
 * FPS counter
 */
export class FPSCounter
{
    /**
     * Creates a new FPSCounter
     * @private
     */
    constructor()
    {
        /** @type {number} current FPS rate */
        this._fps = 60;

        /** @type {number} frame counter */
        this._frames = 0;

        /** @type {number} update interval in milliseconds */
        this._updateInterval = UPDATE_INTERVAL;

        /** @type {number} time of the last update */
        this._lastUpdate = performance.now();

        /** @type {function(): void} bound update function */
        this._boundUpdate = this._update.bind(this);



        // this should never happen...
        if(instance !== null)
            throw new IllegalOperationError(`Can't have multiple instances of FPSCounter`);

        // start FPS counter
        this._boundUpdate();
    }

    /**
     * Gets an instance of the FPS counter.
     * We use lazy loading, i.e., we will not
     * create a FPS counter unless we need to!
     * @returns {FPSCounter}
     */
    static get instance()
    {
        if(instance === null)
            instance = new FPSCounter();

        return instance;
    }

    /**
     * Get the FPS rate
     * @returns {number} frames per second
     */
    get fps()
    {
        return this._fps;
    }

    /**
     * Updates the FPS counter
     */
    _update()
    {
        const now = performance.now();
        const deltaTime = now - this._lastUpdate;

        if(deltaTime >= this._updateInterval) {
            this._fps = Math.round(this._frames / (deltaTime * 0.001));
            this._frames = 0;
            this._lastUpdate = now;
        }

        this._frames++;
        requestAnimationFrame(this._boundUpdate);
    }
}