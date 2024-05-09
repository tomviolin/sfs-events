(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('@photo-sphere-viewer/core')) :
    typeof define === 'function' && define.amd ? define(['exports', 'three', '@photo-sphere-viewer/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.PhotoSphereViewer = global.PhotoSphereViewer || {}, global.PhotoSphereViewer.VideoPlugin = {}), global.THREE, global.PhotoSphereViewer));
})(this, (function (exports, THREE, PhotoSphereViewer) {

console.warn('PhotoSphereViewer "index.js" scripts are deprecated and will be removed in a future version. Please use ES Modules: https://photo-sphere-viewer.js.org/guide/#your-first-viewer');

/*!
 * PhotoSphereViewer.VideoPlugin 5.7.3
 * @copyright 2024 Damien "Mistic" Sorel
 * @licence MIT (https://opensource.org/licenses/MIT)
 */
"use strict";
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };

  // @photo-sphere-viewer/core
  var require_core = () => PhotoSphereViewer;

  // three
  var require_three = () => THREE;

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    VideoPlugin: () => VideoPlugin,
    events: () => events_exports
  });
  var import_core8 = require_core();

  // src/components/PlayPauseButton.ts
  var import_core2 = require_core();

  // src/events.ts
  var events_exports = {};
  __export(events_exports, {
    BufferEvent: () => BufferEvent,
    PlayPauseEvent: () => PlayPauseEvent,
    ProgressEvent: () => ProgressEvent,
    VolumeChangeEvent: () => VolumeChangeEvent
  });
  var import_core = require_core();
  var _PlayPauseEvent = class _PlayPauseEvent extends import_core.TypedEvent {
    /** @internal */
    constructor(playing) {
      super(_PlayPauseEvent.type);
      this.playing = playing;
    }
  };
  _PlayPauseEvent.type = "play-pause";
  var PlayPauseEvent = _PlayPauseEvent;
  var _VolumeChangeEvent = class _VolumeChangeEvent extends import_core.TypedEvent {
    /** @internal */
    constructor(volume) {
      super(_VolumeChangeEvent.type);
      this.volume = volume;
    }
  };
  _VolumeChangeEvent.type = "volume-change";
  var VolumeChangeEvent = _VolumeChangeEvent;
  var _ProgressEvent = class _ProgressEvent extends import_core.TypedEvent {
    /** @internal */
    constructor(time, duration, progress) {
      super(_ProgressEvent.type);
      this.time = time;
      this.duration = duration;
      this.progress = progress;
    }
  };
  _ProgressEvent.type = "progress";
  var ProgressEvent = _ProgressEvent;
  var _BufferEvent = class _BufferEvent extends import_core.TypedEvent {
    /** @internal */
    constructor(maxBuffer) {
      super(_BufferEvent.type);
      this.maxBuffer = maxBuffer;
    }
  };
  _BufferEvent.type = "buffer";
  var BufferEvent = _BufferEvent;

  // src/icons/pause.svg
  var pause_default = '<svg viewBox="80 10 540 540" xmlns="http://www.w3.org/2000/svg"><path d="M80.58 279.67c0-148.76 120.33-269.09 269.09-269.09s269.75 120.33 269.75 269.09-121 269.75-269.75 269.75-269.1-120.99-269.1-269.75zm175.87 105.12V175.2c0-9.26 7.27-15.87 15.86-15.87h39.01c8.6 0 15.87 6.62 15.87 15.87v209.59c0 8.6-7.27 15.87-15.87 15.87h-39c-8.6 0-15.87-7.28-15.87-15.87zm116.36 0V175.2c0-9.26 7.27-15.87 15.86-15.87h38.35c9.26 0 15.87 6.62 15.87 15.87v209.59c0 8.6-6.61 15.87-15.87 15.87h-38.34c-8.6 0-15.87-7.28-15.87-15.87z" fill-rule="evenodd" fill="currentcolor"/></svg>';

  // src/icons/play.svg
  var play_default = '<svg viewBox="76 5 550 550" xmlns="http://www.w3.org/2000/svg"><path fill="currentcolor" d="M351.1 5.6A274.1 274.1 0 0 0 76.7 280a274.1 274.1 0 0 0 274.4 274.4A274.1 274.1 0 0 0 625.5 280 274.1 274.1 0 0 0 351.1 5.6zm146.7 282.8-219 134.4c-6.6 4-15.6-.6-15.6-8.4V145.6c0-7.8 9-12.9 15.7-8.4l219 134.4a10 10 0 0 1 0 16.8z"/></svg>';

  // src/components/PlayPauseButton.ts
  var PlayPauseButton = class extends import_core2.AbstractButton {
    constructor(navbar) {
      super(navbar, {
        className: "psv-video-play-button",
        hoverScale: true,
        collapsable: false,
        tabbable: true,
        icon: play_default,
        iconActive: pause_default
      });
      this.plugin = this.viewer.getPlugin("video");
      this.plugin?.addEventListener(PlayPauseEvent.type, this);
    }
    destroy() {
      this.plugin?.removeEventListener(PlayPauseEvent.type, this);
      super.destroy();
    }
    isSupported() {
      return !!this.plugin;
    }
    handleEvent(e) {
      if (e instanceof PlayPauseEvent) {
        this.toggleActive(e.playing);
      }
    }
    onClick() {
      this.plugin.playPause();
    }
  };
  PlayPauseButton.id = "videoPlay";
  PlayPauseButton.groupId = "video";

  // src/components/TimeCaption.ts
  var import_core3 = require_core();

  // src/utils.ts
  function formatTime(time) {
    const seconds = Math.round(time % 60);
    const minutes = Math.round(time - seconds) / 60;
    return `${minutes}:${("0" + seconds).slice(-2)}`;
  }

  // src/components/TimeCaption.ts
  var TimeCaption = class extends import_core3.AbstractButton {
    constructor(navbar) {
      super(navbar, {
        className: "psv-caption psv-video-time",
        hoverScale: false,
        collapsable: false,
        tabbable: false
      });
      this.contentElt = document.createElement("div");
      this.contentElt.className = "psv-caption-content";
      this.container.appendChild(this.contentElt);
      this.plugin = this.viewer.getPlugin("video");
      if (this.plugin) {
        this.viewer.addEventListener(import_core3.events.PanoramaLoadedEvent.type, this);
        this.plugin.addEventListener(ProgressEvent.type, this);
      }
    }
    destroy() {
      if (this.plugin) {
        this.viewer.removeEventListener(import_core3.events.PanoramaLoadedEvent.type, this);
        this.plugin.removeEventListener(ProgressEvent.type, this);
      }
      delete this.plugin;
      super.destroy();
    }
    handleEvent(e) {
      switch (e.type) {
        case import_core3.events.PanoramaLoadedEvent.type:
        case ProgressEvent.type:
          this.contentElt.innerHTML = `<strong>${formatTime(this.plugin.getTime())}</strong> / ${formatTime(this.plugin.getDuration())}`;
          break;
      }
    }
    onClick() {
    }
  };
  TimeCaption.id = "videoTime";
  TimeCaption.groupId = "video";

  // src/components/VolumeButton.ts
  var import_core4 = require_core();

  // src/icons/volume.svg
  var volume_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="17 16 71 71"><path fill="currentColor" d="M20.19 61.66H32.9c.54 0 1.07.16 1.52.47L51.02 73.5a2.7 2.7 0 0 0 4.22-2.23V28.74a2.7 2.7 0 0 0-4.22-2.23L34.43 37.87c-.45.3-.98.47-1.52.47H20.19a2.7 2.7 0 0 0-2.7 2.7v17.92a2.7 2.7 0 0 0 2.7 2.7z"/><path id="lvl0" fill="currentColor" d="M63.802 58.834c.39.39.902.586 1.414.586s1.023-.195 1.414-.586l7.234-7.233 7.234 7.233c.39.39.902.586 1.414.586s1.023-.195 1.414-.586a2 2 0 0 0 0-2.828l-7.234-7.234 7.234-7.233a2 2 0 1 0-2.828-2.828l-7.234 7.233-7.234-7.233a2 2 0 1 0-2.828 2.828l7.234 7.233-7.234 7.234a2 2 0 0 0 0 2.828z"/><path id="lvl1" fill="currentColor" d="M59.573 59.65c.39.394.904.59 1.418.59.51 0 1.02-.194 1.41-.582A13.53 13.53 0 0 0 66.411 50a13.56 13.56 0 0 0-3.996-9.654 2 2 0 0 0-2.828 2.829A9.586 9.586 0 0 1 62.41 50a9.56 9.56 0 0 1-2.83 6.823 2 2 0 0 0-.008 2.828z"/><path id="lvl2" fill="currentColor" d="M72.501 50c0 5.267-2.055 10.227-5.786 13.967a2 2 0 0 0 2.832 2.825C74.03 62.297 76.5 56.333 76.5 50s-2.47-12.297-6.954-16.792a2 2 0 0 0-2.832 2.825c3.731 3.74 5.786 8.7 5.786 13.967z"/><path id="lvl3" fill="currentColor" d="M83.001 50c0 8.084-3.147 15.679-8.863 21.384a2 2 0 0 0 2.826 2.831C83.437 67.754 87 59.155 87 50c0-9.154-3.564-17.753-10.037-24.215a2 2 0 0 0-2.826 2.83C79.854 34.323 83 41.917 83 50z"/><!--Created by Rudez Studio from the Noun Project--></svg>';

  // src/components/VolumeButton.ts
  var VolumeButton = class extends import_core4.AbstractButton {
    constructor(navbar) {
      super(navbar, {
        className: "psv-video-volume-button",
        hoverScale: true,
        collapsable: false,
        tabbable: true,
        icon: volume_default
      });
      this.plugin = this.viewer.getPlugin("video");
      if (this.plugin) {
        this.rangeContainer = document.createElement("div");
        this.rangeContainer.className = "psv-video-volume__container";
        this.container.appendChild(this.rangeContainer);
        this.range = document.createElement("div");
        this.range.className = "psv-video-volume__range";
        this.rangeContainer.appendChild(this.range);
        this.trackElt = document.createElement("div");
        this.trackElt.className = "psv-video-volume__track";
        this.range.appendChild(this.trackElt);
        this.progressElt = document.createElement("div");
        this.progressElt.className = "psv-video-volume__progress";
        this.range.appendChild(this.progressElt);
        this.handleElt = document.createElement("div");
        this.handleElt.className = "psv-video-volume__handle";
        this.range.appendChild(this.handleElt);
        this.slider = new import_core4.utils.Slider(
          this.range,
          import_core4.utils.SliderDirection.VERTICAL,
          this.__onSliderUpdate.bind(this)
        );
        this.viewer.addEventListener(import_core4.events.PanoramaLoadedEvent.type, this);
        this.plugin.addEventListener(PlayPauseEvent.type, this);
        this.plugin.addEventListener(VolumeChangeEvent.type, this);
        this.__setVolume(0);
      }
    }
    destroy() {
      if (this.plugin) {
        this.viewer.removeEventListener(import_core4.events.PanoramaLoadedEvent.type, this);
        this.plugin.removeEventListener(PlayPauseEvent.type, this);
        this.plugin.removeEventListener(VolumeChangeEvent.type, this);
      }
      this.slider.destroy();
      super.destroy();
    }
    isSupported() {
      return !!this.plugin;
    }
    handleEvent(e) {
      switch (e.type) {
        case import_core4.events.PanoramaLoadedEvent.type:
        case PlayPauseEvent.type:
        case VolumeChangeEvent.type:
          this.__setVolume(this.plugin.getVolume());
          break;
      }
    }
    onClick() {
      this.plugin.setMute();
    }
    __onSliderUpdate(data) {
      if (data.mousedown) {
        this.plugin.setVolume(data.value);
      }
    }
    __setVolume(volume) {
      let level;
      if (volume === 0)
        level = 0;
      else if (volume < 0.333)
        level = 1;
      else if (volume < 0.666)
        level = 2;
      else
        level = 3;
      import_core4.utils.toggleClass(this.container, "psv-video-volume-button--0", level === 0);
      import_core4.utils.toggleClass(this.container, "psv-video-volume-button--1", level === 1);
      import_core4.utils.toggleClass(this.container, "psv-video-volume-button--2", level === 2);
      import_core4.utils.toggleClass(this.container, "psv-video-volume-button--3", level === 3);
      this.handleElt.style.bottom = `${volume * 100}%`;
      this.progressElt.style.height = `${volume * 100}%`;
    }
  };
  VolumeButton.id = "videoVolume";
  VolumeButton.groupId = "video";

  // src/VideoPlugin.ts
  var import_core7 = require_core();
  var import_three = require_three();

  // src/components/PauseOverlay.ts
  var import_core5 = require_core();
  var PauseOverlay = class extends import_core5.AbstractComponent {
    constructor(plugin, viewer) {
      super(viewer, {
        className: "psv-video-overlay"
      });
      this.plugin = plugin;
      this.button = document.createElement("button");
      this.button.className = `psv-video-bigbutton ${import_core5.CONSTANTS.CAPTURE_EVENTS_CLASS}`;
      this.button.innerHTML = play_default;
      this.container.appendChild(this.button);
      this.viewer.addEventListener(import_core5.events.PanoramaLoadedEvent.type, this);
      this.plugin.addEventListener(PlayPauseEvent.type, this);
      this.button.addEventListener("click", this);
    }
    destroy() {
      this.viewer.removeEventListener(import_core5.events.PanoramaLoadedEvent.type, this);
      this.plugin.removeEventListener(PlayPauseEvent.type, this);
      super.destroy();
    }
    handleEvent(e) {
      switch (e.type) {
        case import_core5.events.PanoramaLoadedEvent.type:
        case PlayPauseEvent.type:
          import_core5.utils.toggleClass(this.button, "psv-video-bigbutton--pause", !this.plugin.isPlaying());
          break;
        case "click":
          this.plugin.playPause();
          break;
      }
    }
  };

  // src/components/ProgressBar.ts
  var import_core6 = require_core();
  var ProgressBar = class extends import_core6.AbstractComponent {
    constructor(plugin, viewer) {
      super(viewer, {
        className: "psv-video-progressbar"
      });
      this.plugin = plugin;
      this.state = {
        visible: true,
        req: null,
        tooltip: null
      };
      this.bufferElt = document.createElement("div");
      this.bufferElt.className = "psv-video-progressbar__buffer";
      this.container.appendChild(this.bufferElt);
      this.progressElt = document.createElement("div");
      this.progressElt.className = "psv-video-progressbar__progress";
      this.container.appendChild(this.progressElt);
      this.handleElt = document.createElement("div");
      this.handleElt.className = "psv-video-progressbar__handle";
      this.container.appendChild(this.handleElt);
      this.slider = new import_core6.utils.Slider(
        this.container,
        import_core6.utils.SliderDirection.HORIZONTAL,
        this.__onSliderUpdate.bind(this)
      );
      this.viewer.addEventListener(import_core6.events.PanoramaLoadedEvent.type, this);
      this.plugin.addEventListener(BufferEvent.type, this);
      this.plugin.addEventListener(ProgressEvent.type, this);
      this.state.req = window.requestAnimationFrame(() => this.__updateProgress());
      this.hide();
    }
    destroy() {
      this.viewer.removeEventListener(import_core6.events.PanoramaLoadedEvent.type, this);
      this.plugin.removeEventListener(BufferEvent.type, this);
      this.plugin.removeEventListener(ProgressEvent.type, this);
      this.slider.destroy();
      this.state.tooltip?.hide();
      window.cancelAnimationFrame(this.state.req);
      delete this.state.tooltip;
      super.destroy();
    }
    /**
     * @internal
     */
    handleEvent(e) {
      switch (e.type) {
        case import_core6.events.PanoramaLoadedEvent.type:
        case BufferEvent.type:
        case ProgressEvent.type:
          this.bufferElt.style.width = `${this.plugin.getBufferProgress() * 100}%`;
          break;
      }
    }
    __updateProgress() {
      this.progressElt.style.width = `${this.plugin.getProgress() * 100}%`;
      this.state.req = window.requestAnimationFrame(() => this.__updateProgress());
    }
    __onSliderUpdate(data) {
      if (data.mouseover) {
        this.handleElt.style.display = "block";
        this.handleElt.style.left = `${data.value * 100}%`;
        const time = formatTime(this.plugin.getDuration() * data.value);
        if (!this.state.tooltip) {
          this.state.tooltip = this.viewer.createTooltip({
            top: data.cursor.clientY,
            left: data.cursor.clientX,
            content: time
          });
        } else {
          this.state.tooltip.update(time, {
            top: data.cursor.clientY,
            left: data.cursor.clientX
          });
        }
      } else {
        this.handleElt.style.display = "none";
        this.state.tooltip?.hide();
        delete this.state.tooltip;
      }
      if (data.click) {
        this.plugin.setProgress(data.value);
      }
    }
  };

  // src/VideoPlugin.ts
  var getConfig = import_core7.utils.getConfigParser({
    progressbar: true,
    bigbutton: true,
    keypoints: null
  });
  var VideoPlugin = class extends import_core7.AbstractConfigurablePlugin {
    constructor(viewer, config) {
      super(viewer, config);
      this.state = {
        curve: null,
        start: null,
        end: null,
        keypoints: null
      };
      if (!this.viewer.adapter.constructor.id.includes("video")) {
        throw new import_core7.PSVError("VideoPlugin can only be used with a video adapter.");
      }
      if (this.config.progressbar) {
        this.progressbar = new ProgressBar(this, viewer);
      }
      if (this.config.bigbutton) {
        this.overlay = new PauseOverlay(this, viewer);
      }
    }
    /**
     * @internal
     */
    init() {
      super.init();
      import_core7.utils.checkStylesheet(this.viewer.container, "video-plugin");
      this.markers = this.viewer.getPlugin("markers");
      this.autorotate = this.viewer.getPlugin("autorotate");
      if (this.autorotate) {
        this.autorotate.config.autostartDelay = 0;
        this.autorotate.config.autostartOnIdle = false;
      }
      if (this.config.keypoints) {
        this.setKeypoints(this.config.keypoints);
        delete this.config.keypoints;
      }
      this.autorotate?.addEventListener("autorotate", this);
      this.viewer.addEventListener(import_core7.events.BeforeRenderEvent.type, this);
      this.viewer.addEventListener(import_core7.events.PanoramaLoadedEvent.type, this);
      this.viewer.addEventListener(import_core7.events.KeypressEvent.type, this);
    }
    /**
     * @internal
     */
    destroy() {
      this.autorotate?.removeEventListener("autorotate", this);
      this.viewer.removeEventListener(import_core7.events.BeforeRenderEvent.type, this);
      this.viewer.removeEventListener(import_core7.events.PanoramaLoadedEvent.type, this);
      this.viewer.removeEventListener(import_core7.events.KeypressEvent.type, this);
      delete this.progressbar;
      delete this.overlay;
      delete this.markers;
      super.destroy();
    }
    /**
     * @internal
     */
    handleEvent(e) {
      switch (e.type) {
        case import_core7.events.BeforeRenderEvent.type:
          this.__autorotate();
          break;
        case "autorotate":
          this.__configureAutorotate();
          break;
        case import_core7.events.PanoramaLoadedEvent.type:
          this.__bindVideo(e.data);
          this.progressbar?.show();
          break;
        case import_core7.events.KeypressEvent.type:
          this.__onKeyPress(e);
          break;
        case "play":
        case "pause":
          this.dispatchEvent(new PlayPauseEvent(this.isPlaying()));
          break;
        case "progress":
          this.dispatchEvent(new BufferEvent(this.getBufferProgress()));
          break;
        case "volumechange":
          this.dispatchEvent(new VolumeChangeEvent(this.getVolume()));
          break;
        case "timeupdate":
          this.dispatchEvent(new ProgressEvent(this.getTime(), this.getDuration(), this.getProgress()));
          break;
      }
    }
    __bindVideo(textureData) {
      if (this.video) {
        this.video.removeEventListener("play", this);
        this.video.removeEventListener("pause", this);
        this.video.removeEventListener("progress", this);
        this.video.removeEventListener("volumechange", this);
        this.video.removeEventListener("timeupdate", this);
      }
      this.video = textureData.texture.image;
      this.video.addEventListener("play", this);
      this.video.addEventListener("pause", this);
      this.video.addEventListener("progress", this);
      this.video.addEventListener("volumechange", this);
      this.video.addEventListener("timeupdate", this);
    }
    __onKeyPress(e) {
      if (e.key === import_core7.CONSTANTS.KEY_CODES.Space) {
        this.playPause();
        e.preventDefault();
      }
    }
    /**
     * Returns the durection of the video
     */
    getDuration() {
      return this.video?.duration ?? 0;
    }
    /**
     * Returns the current time of the video
     */
    getTime() {
      return this.video?.currentTime ?? 0;
    }
    /**
     * Returns the play progression of the video
     */
    getProgress() {
      return this.video ? this.video.currentTime / this.video.duration : 0;
    }
    /**
     * Returns if the video is playing
     */
    isPlaying() {
      return this.video ? !this.video.paused : false;
    }
    /**
     * Returns the video volume
     */
    getVolume() {
      return this.video?.muted ? 0 : this.video?.volume ?? 0;
    }
    /**
     * Starts or pause the video
     */
    playPause() {
      if (this.video) {
        if (this.video.paused) {
          this.video.play();
        } else {
          this.video.pause();
        }
      }
    }
    /**
     * Starts the video if paused
     */
    play() {
      if (this.video?.paused) {
        this.video.play();
      }
    }
    /**
     * Pauses the cideo if playing
     */
    pause() {
      if (this.video && !this.video.paused) {
        this.video.pause();
      }
    }
    /**
     * Sets the volume of the video
     */
    setVolume(volume) {
      if (this.video) {
        this.video.muted = false;
        this.video.volume = import_three.MathUtils.clamp(volume, 0, 1);
      }
    }
    /**
     * (Un)mutes the video
     * @param [mute] - toggle if undefined
     */
    setMute(mute) {
      if (this.video) {
        this.video.muted = mute === void 0 ? !this.video.muted : mute;
        if (!this.video.muted && this.video.volume === 0) {
          this.video.volume = 0.1;
        }
      }
    }
    /**
     * Changes the current time of the video
     */
    setTime(time) {
      if (this.video) {
        this.video.currentTime = time;
      }
    }
    /**
     * Changes the progression of the video
     */
    setProgress(progress) {
      if (this.video) {
        this.video.currentTime = this.video.duration * progress;
      }
    }
    /**
     * @internal
     */
    getBufferProgress() {
      if (this.video) {
        let maxBuffer = 0;
        const buffer = this.video.buffered;
        for (let i = 0, l = buffer.length; i < l; i++) {
          if (buffer.start(i) <= this.video.currentTime && buffer.end(i) >= this.video.currentTime) {
            maxBuffer = buffer.end(i);
            break;
          }
        }
        return Math.max(this.video.currentTime, maxBuffer) / this.video.duration;
      } else {
        return 0;
      }
    }
    /**
     * Changes the keypoints
     * @throws {@link PSVError} if the configuration is invalid
     */
    setKeypoints(keypoints) {
      if (!this.autorotate) {
        throw new import_core7.PSVError("Video keypoints required the AutorotatePlugin");
      }
      if (!keypoints) {
        this.state.keypoints = null;
        this.__configureAutorotate();
        return;
      }
      if (keypoints.length < 2) {
        throw new import_core7.PSVError("At least two points are required");
      }
      this.state.keypoints = import_core7.utils.clone(keypoints);
      if (this.state.keypoints) {
        this.state.keypoints.forEach((pt, i) => {
          if (pt.position) {
            pt.position = this.viewer.dataHelper.cleanPosition(pt.position);
          } else {
            throw new import_core7.PSVError(`Keypoint #${i} is missing marker or position`);
          }
          if (import_core7.utils.isNil(pt.time)) {
            throw new import_core7.PSVError(`Keypoint #${i} is missing time`);
          }
        });
        this.state.keypoints.sort((a, b) => a.time - b.time);
      }
      this.__configureAutorotate();
    }
    __configureAutorotate() {
      delete this.state.curve;
      delete this.state.start;
      delete this.state.end;
      if (this.autorotate.isEnabled() && this.state.keypoints) {
        this.viewer.dynamics.position.stop();
      }
    }
    __autorotate() {
      if (!this.autorotate?.isEnabled() || !this.state.keypoints) {
        return;
      }
      const currentTime = this.getTime();
      const autorotate = this.state;
      if (!autorotate.curve || currentTime < autorotate.start.time || currentTime >= autorotate.end.time) {
        this.__autorotateNext(currentTime);
      }
      if (autorotate.start === autorotate.end) {
        this.viewer.rotate(autorotate.start.position);
      } else {
        const progress = (currentTime - autorotate.start.time) / (autorotate.end.time - autorotate.start.time);
        const pt = autorotate.curve.getPoint(1 / 3 + progress / 3);
        this.viewer.dynamics.position.goto({ yaw: pt.x, pitch: pt.y });
      }
    }
    __autorotateNext(currentTime) {
      let k1 = null;
      let k2 = null;
      const keypoints = this.state.keypoints;
      const l = keypoints.length - 1;
      if (currentTime < keypoints[0].time) {
        k1 = 0;
        k2 = 0;
      }
      for (let i = 0; i < l; i++) {
        if (currentTime >= keypoints[i].time && currentTime < keypoints[i + 1].time) {
          k1 = i;
          k2 = i + 1;
          break;
        }
      }
      if (currentTime >= keypoints[l].time) {
        k1 = l;
        k2 = l;
      }
      const workPoints = [
        keypoints[Math.max(0, k1 - 1)].position,
        keypoints[k1].position,
        keypoints[k2].position,
        keypoints[Math.min(l, k2 + 1)].position
      ];
      const workVectors = [new import_three.Vector2(workPoints[0].yaw, workPoints[0].pitch)];
      let k = 0;
      for (let i = 1; i <= 3; i++) {
        const d = workPoints[i - 1].yaw - workPoints[i].yaw;
        if (d > Math.PI) {
          k += 1;
        } else if (d < -Math.PI) {
          k -= 1;
        }
        if (k !== 0 && i === 1) {
          workVectors[0].x -= k * 2 * Math.PI;
          k = 0;
        }
        workVectors.push(new import_three.Vector2(workPoints[i].yaw + k * 2 * Math.PI, workPoints[i].pitch));
      }
      this.state.curve = new import_three.SplineCurve(workVectors);
      this.state.start = keypoints[k1];
      this.state.end = keypoints[k2];
    }
  };
  VideoPlugin.id = "video";
  VideoPlugin.VERSION = "5.7.3";
  VideoPlugin.configParser = getConfig;
  VideoPlugin.readonlyOptions = Object.keys(getConfig.defaults);

  // src/index.ts
  import_core8.DEFAULTS.lang[PlayPauseButton.id] = "Play/Pause";
  import_core8.DEFAULTS.lang[VolumeButton.id] = "Volume";
  (0, import_core8.registerButton)(PlayPauseButton);
  (0, import_core8.registerButton)(VolumeButton);
  (0, import_core8.registerButton)(TimeCaption);
  import_core8.DEFAULTS.navbar.unshift(PlayPauseButton.groupId);
  __copyProps(__defProp(exports, "__esModule", { value: true }), src_exports);

}));//# sourceMappingURL=index.js.map