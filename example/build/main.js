/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "0c830b51cfa98300ff79"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./index.js")(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/@webcomponents/custom-elements/src/AlreadyConstructedMarker.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * This class exists only to work around Closure's lack of a way to describe
 * singletons. It represents the 'already constructed marker' used in custom
 * element construction stacks.
 *
 * https://html.spec.whatwg.org/#concept-already-constructed-marker
 */
class AlreadyConstructedMarker {}

/* harmony default export */ __webpack_exports__["a"] = (new AlreadyConstructedMarker());

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utilities_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CustomElementState_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementState.js");



class CustomElementInternals {
  constructor() {
    /** @type {!Map<string, !CustomElementDefinition>} */
    this._localNameToDefinition = new Map();

    /** @type {!Map<!Function, !CustomElementDefinition>} */
    this._constructorToDefinition = new Map();

    /** @type {!Array<!function(!Node)>} */
    this._patches = [];

    /** @type {boolean} */
    this._hasPatches = false;
  }

  /**
   * @param {string} localName
   * @param {!CustomElementDefinition} definition
   */
  setDefinition(localName, definition) {
    this._localNameToDefinition.set(localName, definition);
    this._constructorToDefinition.set(definition.constructor, definition);
  }

  /**
   * @param {string} localName
   * @return {!CustomElementDefinition|undefined}
   */
  localNameToDefinition(localName) {
    return this._localNameToDefinition.get(localName);
  }

  /**
   * @param {!Function} constructor
   * @return {!CustomElementDefinition|undefined}
   */
  constructorToDefinition(constructor) {
    return this._constructorToDefinition.get(constructor);
  }

  /**
   * @param {!function(!Node)} listener
   */
  addPatch(listener) {
    this._hasPatches = true;
    this._patches.push(listener);
  }

  /**
   * @param {!Node} node
   */
  patchTree(node) {
    if (!this._hasPatches) return;

    __WEBPACK_IMPORTED_MODULE_0__Utilities_js__["d" /* walkDeepDescendantElements */](node, element => this.patch(element));
  }

  /**
   * @param {!Node} node
   */
  patch(node) {
    if (!this._hasPatches) return;

    if (node.__CE_patched) return;
    node.__CE_patched = true;

    for (let i = 0; i < this._patches.length; i++) {
      this._patches[i](node);
    }
  }

  /**
   * @param {!Node} root
   */
  connectTree(root) {
    const elements = [];

    __WEBPACK_IMPORTED_MODULE_0__Utilities_js__["d" /* walkDeepDescendantElements */](root, element => elements.push(element));

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.__CE_state === __WEBPACK_IMPORTED_MODULE_1__CustomElementState_js__["a" /* default */].custom) {
        this.connectedCallback(element);
      } else {
        this.upgradeElement(element);
      }
    }
  }

  /**
   * @param {!Node} root
   */
  disconnectTree(root) {
    const elements = [];

    __WEBPACK_IMPORTED_MODULE_0__Utilities_js__["d" /* walkDeepDescendantElements */](root, element => elements.push(element));

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.__CE_state === __WEBPACK_IMPORTED_MODULE_1__CustomElementState_js__["a" /* default */].custom) {
        this.disconnectedCallback(element);
      }
    }
  }

  /**
   * Upgrades all uncustomized custom elements at and below a root node for
   * which there is a definition. When custom element reaction callbacks are
   * assumed to be called synchronously (which, by the current DOM / HTML spec
   * definitions, they are *not*), callbacks for both elements customized
   * synchronously by the parser and elements being upgraded occur in the same
   * relative order.
   *
   * NOTE: This function, when used to simulate the construction of a tree that
   * is already created but not customized (i.e. by the parser), does *not*
   * prevent the element from reading the 'final' (true) state of the tree. For
   * example, the element, during truly synchronous parsing / construction would
   * see that it contains no children as they have not yet been inserted.
   * However, this function does not modify the tree, the element will
   * (incorrectly) have children. Additionally, self-modification restrictions
   * for custom element constructors imposed by the DOM spec are *not* enforced.
   *
   *
   * The following nested list shows the steps extending down from the HTML
   * spec's parsing section that cause elements to be synchronously created and
   * upgraded:
   *
   * The "in body" insertion mode:
   * https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
   * - Switch on token:
   *   .. other cases ..
   *   -> Any other start tag
   *      - [Insert an HTML element](below) for the token.
   *
   * Insert an HTML element:
   * https://html.spec.whatwg.org/multipage/syntax.html#insert-an-html-element
   * - Insert a foreign element for the token in the HTML namespace:
   *   https://html.spec.whatwg.org/multipage/syntax.html#insert-a-foreign-element
   *   - Create an element for a token:
   *     https://html.spec.whatwg.org/multipage/syntax.html#create-an-element-for-the-token
   *     - Will execute script flag is true?
   *       - (Element queue pushed to the custom element reactions stack.)
   *     - Create an element:
   *       https://dom.spec.whatwg.org/#concept-create-element
   *       - Sync CE flag is true?
   *         - Constructor called.
   *         - Self-modification restrictions enforced.
   *       - Sync CE flag is false?
   *         - (Upgrade reaction enqueued.)
   *     - Attributes appended to element.
   *       (`attributeChangedCallback` reactions enqueued.)
   *     - Will execute script flag is true?
   *       - (Element queue popped from the custom element reactions stack.
   *         Reactions in the popped stack are invoked.)
   *   - (Element queue pushed to the custom element reactions stack.)
   *   - Insert the element:
   *     https://dom.spec.whatwg.org/#concept-node-insert
   *     - Shadow-including descendants are connected. During parsing
   *       construction, there are no shadow-*excluding* descendants.
   *       However, the constructor may have validly attached a shadow
   *       tree to itself and added descendants to that shadow tree.
   *       (`connectedCallback` reactions enqueued.)
   *   - (Element queue popped from the custom element reactions stack.
   *     Reactions in the popped stack are invoked.)
   *
   * @param {!Node} root
   * @param {!Set<Node>=} visitedImports
   */
  patchAndUpgradeTree(root, visitedImports = new Set()) {
    const elements = [];

    const gatherElements = element => {
      if (element.localName === 'link' && element.getAttribute('rel') === 'import') {
        // The HTML Imports polyfill sets a descendant element of the link to
        // the `import` property, specifically this is *not* a Document.
        const importNode = /** @type {?Node} */element.import;

        if (importNode instanceof Node && importNode.readyState === 'complete') {
          importNode.__CE_isImportDocument = true;

          // Connected links are associated with the registry.
          importNode.__CE_hasRegistry = true;
        } else {
          // If this link's import root is not available, its contents can't be
          // walked. Wait for 'load' and walk it when it's ready.
          element.addEventListener('load', () => {
            const importNode = /** @type {!Node} */element.import;

            if (importNode.__CE_documentLoadHandled) return;
            importNode.__CE_documentLoadHandled = true;

            importNode.__CE_isImportDocument = true;

            // Connected links are associated with the registry.
            importNode.__CE_hasRegistry = true;

            // Clone the `visitedImports` set that was populated sync during
            // the `patchAndUpgradeTree` call that caused this 'load' handler to
            // be added. Then, remove *this* link's import node so that we can
            // walk that import again, even if it was partially walked later
            // during the same `patchAndUpgradeTree` call.
            const clonedVisitedImports = new Set(visitedImports);
            visitedImports.delete(importNode);

            this.patchAndUpgradeTree(importNode, visitedImports);
          });
        }
      } else {
        elements.push(element);
      }
    };

    // `walkDeepDescendantElements` populates (and internally checks against)
    // `visitedImports` when traversing a loaded import.
    __WEBPACK_IMPORTED_MODULE_0__Utilities_js__["d" /* walkDeepDescendantElements */](root, gatherElements, visitedImports);

    if (this._hasPatches) {
      for (let i = 0; i < elements.length; i++) {
        this.patch(elements[i]);
      }
    }

    for (let i = 0; i < elements.length; i++) {
      this.upgradeElement(elements[i]);
    }
  }

  /**
   * @param {!Element} element
   */
  upgradeElement(element) {
    const currentState = element.__CE_state;
    if (currentState !== undefined) return;

    const definition = this.localNameToDefinition(element.localName);
    if (!definition) return;

    definition.constructionStack.push(element);

    const constructor = definition.constructor;
    try {
      try {
        let result = new constructor();
        if (result !== element) {
          throw new Error('The custom element constructor did not produce the element being upgraded.');
        }
      } finally {
        definition.constructionStack.pop();
      }
    } catch (e) {
      element.__CE_state = __WEBPACK_IMPORTED_MODULE_1__CustomElementState_js__["a" /* default */].failed;
      throw e;
    }

    element.__CE_state = __WEBPACK_IMPORTED_MODULE_1__CustomElementState_js__["a" /* default */].custom;
    element.__CE_definition = definition;

    if (definition.attributeChangedCallback) {
      const observedAttributes = definition.observedAttributes;
      for (let i = 0; i < observedAttributes.length; i++) {
        const name = observedAttributes[i];
        const value = element.getAttribute(name);
        if (value !== null) {
          this.attributeChangedCallback(element, name, null, value, null);
        }
      }
    }

    if (__WEBPACK_IMPORTED_MODULE_0__Utilities_js__["c" /* isConnected */](element)) {
      this.connectedCallback(element);
    }
  }

  /**
   * @param {!Element} element
   */
  connectedCallback(element) {
    const definition = element.__CE_definition;
    if (definition.connectedCallback) {
      definition.connectedCallback.call(element);
    }
  }

  /**
   * @param {!Element} element
   */
  disconnectedCallback(element) {
    const definition = element.__CE_definition;
    if (definition.disconnectedCallback) {
      definition.disconnectedCallback.call(element);
    }
  }

  /**
   * @param {!Element} element
   * @param {string} name
   * @param {?string} oldValue
   * @param {?string} newValue
   * @param {?string} namespace
   */
  attributeChangedCallback(element, name, oldValue, newValue, namespace) {
    const definition = element.__CE_definition;
    if (definition.attributeChangedCallback && definition.observedAttributes.indexOf(name) > -1) {
      definition.attributeChangedCallback.call(element, name, oldValue, newValue, namespace);
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CustomElementInternals;


/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/CustomElementRegistry.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CustomElementInternals_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__DocumentConstructionObserver_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/DocumentConstructionObserver.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Deferred_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Deferred.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Utilities_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");





/**
 * @unrestricted
 */
class CustomElementRegistry {

  /**
   * @param {!CustomElementInternals} internals
   */
  constructor(internals) {
    /**
     * @private
     * @type {boolean}
     */
    this._elementDefinitionIsRunning = false;

    /**
     * @private
     * @type {!CustomElementInternals}
     */
    this._internals = internals;

    /**
     * @private
     * @type {!Map<string, !Deferred<undefined>>}
     */
    this._whenDefinedDeferred = new Map();

    /**
     * The default flush callback triggers the document walk synchronously.
     * @private
     * @type {!Function}
     */
    this._flushCallback = fn => fn();

    /**
     * @private
     * @type {boolean}
     */
    this._flushPending = false;

    /**
     * @private
     * @type {!Array<string>}
     */
    this._unflushedLocalNames = [];

    /**
     * @private
     * @type {!DocumentConstructionObserver}
     */
    this._documentConstructionObserver = new __WEBPACK_IMPORTED_MODULE_1__DocumentConstructionObserver_js__["a" /* default */](internals, document);
  }

  /**
   * @param {string} localName
   * @param {!Function} constructor
   */
  define(localName, constructor) {
    if (!(constructor instanceof Function)) {
      throw new TypeError('Custom element constructors must be functions.');
    }

    if (!__WEBPACK_IMPORTED_MODULE_3__Utilities_js__["a" /* isValidCustomElementName */](localName)) {
      throw new SyntaxError(`The element name '${localName}' is not valid.`);
    }

    if (this._internals.localNameToDefinition(localName)) {
      throw new Error(`A custom element with name '${localName}' has already been defined.`);
    }

    if (this._elementDefinitionIsRunning) {
      throw new Error('A custom element is already being defined.');
    }
    this._elementDefinitionIsRunning = true;

    let connectedCallback;
    let disconnectedCallback;
    let adoptedCallback;
    let attributeChangedCallback;
    let observedAttributes;
    try {
      /** @type {!Object} */
      const prototype = constructor.prototype;
      if (!(prototype instanceof Object)) {
        throw new TypeError('The custom element constructor\'s prototype is not an object.');
      }

      function getCallback(name) {
        const callbackValue = prototype[name];
        if (callbackValue !== undefined && !(callbackValue instanceof Function)) {
          throw new Error(`The '${name}' callback must be a function.`);
        }
        return callbackValue;
      }

      connectedCallback = getCallback('connectedCallback');
      disconnectedCallback = getCallback('disconnectedCallback');
      adoptedCallback = getCallback('adoptedCallback');
      attributeChangedCallback = getCallback('attributeChangedCallback');
      observedAttributes = constructor['observedAttributes'] || [];
    } catch (e) {
      return;
    } finally {
      this._elementDefinitionIsRunning = false;
    }

    const definition = {
      localName,
      constructor,
      connectedCallback,
      disconnectedCallback,
      adoptedCallback,
      attributeChangedCallback,
      observedAttributes,
      constructionStack: []
    };

    this._internals.setDefinition(localName, definition);

    this._unflushedLocalNames.push(localName);

    // If we've already called the flush callback and it hasn't called back yet,
    // don't call it again.
    if (!this._flushPending) {
      this._flushPending = true;
      this._flushCallback(() => this._flush());
    }
  }

  _flush() {
    // If no new definitions were defined, don't attempt to flush. This could
    // happen if a flush callback keeps the function it is given and calls it
    // multiple times.
    if (this._flushPending === false) return;

    this._flushPending = false;
    this._internals.patchAndUpgradeTree(document);

    while (this._unflushedLocalNames.length > 0) {
      const localName = this._unflushedLocalNames.shift();
      const deferred = this._whenDefinedDeferred.get(localName);
      if (deferred) {
        deferred.resolve(undefined);
      }
    }
  }

  /**
   * @param {string} localName
   * @return {Function|undefined}
   */
  get(localName) {
    const definition = this._internals.localNameToDefinition(localName);
    if (definition) {
      return definition.constructor;
    }

    return undefined;
  }

  /**
   * @param {string} localName
   * @return {!Promise<undefined>}
   */
  whenDefined(localName) {
    if (!__WEBPACK_IMPORTED_MODULE_3__Utilities_js__["a" /* isValidCustomElementName */](localName)) {
      return Promise.reject(new SyntaxError(`'${localName}' is not a valid custom element name.`));
    }

    const prior = this._whenDefinedDeferred.get(localName);
    if (prior) {
      return prior.toPromise();
    }

    const deferred = new __WEBPACK_IMPORTED_MODULE_2__Deferred_js__["a" /* default */]();
    this._whenDefinedDeferred.set(localName, deferred);

    const definition = this._internals.localNameToDefinition(localName);
    // Resolve immediately only if the given local name has a definition *and*
    // the full document walk to upgrade elements with that local name has
    // already happened.
    if (definition && this._unflushedLocalNames.indexOf(localName) === -1) {
      deferred.resolve(undefined);
    }

    return deferred.toPromise();
  }

  polyfillWrapFlushCallback(outer) {
    this._documentConstructionObserver.disconnect();
    const inner = this._flushCallback;
    this._flushCallback = flush => outer(() => inner(flush));
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CustomElementRegistry;


// Closure compiler exports.
window['CustomElementRegistry'] = CustomElementRegistry;
CustomElementRegistry.prototype['define'] = CustomElementRegistry.prototype.define;
CustomElementRegistry.prototype['get'] = CustomElementRegistry.prototype.get;
CustomElementRegistry.prototype['whenDefined'] = CustomElementRegistry.prototype.whenDefined;
CustomElementRegistry.prototype['polyfillWrapFlushCallback'] = CustomElementRegistry.prototype.polyfillWrapFlushCallback;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/CustomElementState.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @enum {number}
 */
const CustomElementState = {
  custom: 1,
  failed: 2
};

/* harmony default export */ __webpack_exports__["a"] = (CustomElementState);

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Deferred.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @template T
 */
class Deferred {
  constructor() {
    /**
     * @private
     * @type {T|undefined}
     */
    this._value = undefined;

    /**
     * @private
     * @type {Function|undefined}
     */
    this._resolve = undefined;

    /**
     * @private
     * @type {!Promise<T>}
     */
    this._promise = new Promise(resolve => {
      this._resolve = resolve;

      if (this._value) {
        resolve(this._value);
      }
    });
  }

  /**
   * @param {T} value
   */
  resolve(value) {
    if (this._value) {
      throw new Error('Already resolved.');
    }

    this._value = value;

    if (this._resolve) {
      this._resolve(value);
    }
  }

  /**
   * @return {!Promise<T>}
   */
  toPromise() {
    return this._promise;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Deferred;


/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/DocumentConstructionObserver.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CustomElementInternals_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");


class DocumentConstructionObserver {
  constructor(internals, doc) {
    /**
     * @type {!CustomElementInternals}
     */
    this._internals = internals;

    /**
     * @type {!Document}
     */
    this._document = doc;

    /**
     * @type {MutationObserver|undefined}
     */
    this._observer = undefined;

    // Simulate tree construction for all currently accessible nodes in the
    // document.
    this._internals.patchAndUpgradeTree(this._document);

    if (this._document.readyState === 'loading') {
      this._observer = new MutationObserver(this._handleMutations.bind(this));

      // Nodes created by the parser are given to the observer *before* the next
      // task runs. Inline scripts are run in a new task. This means that the
      // observer will be able to handle the newly parsed nodes before the inline
      // script is run.
      this._observer.observe(this._document, {
        childList: true,
        subtree: true
      });
    }
  }

  disconnect() {
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  /**
   * @param {!Array<!MutationRecord>} mutations
   */
  _handleMutations(mutations) {
    // Once the document's `readyState` is 'interactive' or 'complete', all new
    // nodes created within that document will be the result of script and
    // should be handled by patching.
    const readyState = this._document.readyState;
    if (readyState === 'interactive' || readyState === 'complete') {
      this.disconnect();
    }

    for (let i = 0; i < mutations.length; i++) {
      const addedNodes = mutations[i].addedNodes;
      for (let j = 0; j < addedNodes.length; j++) {
        const node = addedNodes[j];
        this._internals.patchAndUpgradeTree(node);
      }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DocumentConstructionObserver;


/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Document.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Native_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CustomElementInternals_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Utilities_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Interface_ParentNode_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ParentNode.js");






/**
 * @param {!CustomElementInternals} internals
 */
/* harmony default export */ __webpack_exports__["a"] = (function (internals) {
  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["b" /* setPropertyUnchecked */](Document.prototype, 'createElement',
  /**
   * @this {Document}
   * @param {string} localName
   * @return {!Element}
   */
  function (localName) {
    // Only create custom elements if this document is associated with the registry.
    if (this.__CE_hasRegistry) {
      const definition = internals.localNameToDefinition(localName);
      if (definition) {
        return new definition.constructor();
      }
    }

    const result = /** @type {!Element} */
    __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_createElement.call(this, localName);
    internals.patch(result);
    return result;
  });

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["b" /* setPropertyUnchecked */](Document.prototype, 'importNode',
  /**
   * @this {Document}
   * @param {!Node} node
   * @param {boolean=} deep
   * @return {!Node}
   */
  function (node, deep) {
    const clone = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_importNode.call(this, node, deep);
    // Only create custom elements if this document is associated with the registry.
    if (!this.__CE_hasRegistry) {
      internals.patchTree(clone);
    } else {
      internals.patchAndUpgradeTree(clone);
    }
    return clone;
  });

  const NS_HTML = "http://www.w3.org/1999/xhtml";

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["b" /* setPropertyUnchecked */](Document.prototype, 'createElementNS',
  /**
   * @this {Document}
   * @param {?string} namespace
   * @param {string} localName
   * @return {!Element}
   */
  function (namespace, localName) {
    // Only create custom elements if this document is associated with the registry.
    if (this.__CE_hasRegistry && (namespace === null || namespace === NS_HTML)) {
      const definition = internals.localNameToDefinition(localName);
      if (definition) {
        return new definition.constructor();
      }
    }

    const result = /** @type {!Element} */
    __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_createElementNS.call(this, namespace, localName);
    internals.patch(result);
    return result;
  });

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__Interface_ParentNode_js__["a" /* default */])(internals, Document.prototype, {
    prepend: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_prepend,
    append: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_append
  });
});;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Element.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Native_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CustomElementInternals_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementState.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Utilities_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Interface_ParentNode_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ParentNode.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Interface_ChildNode_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ChildNode.js");








/**
 * @param {!CustomElementInternals} internals
 */
/* harmony default export */ __webpack_exports__["a"] = (function (internals) {
  if (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_attachShadow) {
    __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["b" /* setPropertyUnchecked */](Element.prototype, 'attachShadow',
    /**
     * @this {Element}
     * @param {!{mode: string}} init
     * @return {ShadowRoot}
     */
    function (init) {
      const shadowRoot = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_attachShadow.call(this, init);
      this.__CE_shadowRoot = shadowRoot;
      return shadowRoot;
    });
  } else {
    console.warn('Custom Elements: `Element#attachShadow` was not patched.');
  }

  function patch_innerHTML(destination, baseDescriptor) {
    Object.defineProperty(destination, 'innerHTML', {
      enumerable: baseDescriptor.enumerable,
      configurable: true,
      get: baseDescriptor.get,
      set: /** @this {Element} */function (htmlString) {
        const isConnected = __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["c" /* isConnected */](this);

        // NOTE: In IE11, when using the native `innerHTML` setter, all nodes
        // that were previously descendants of the context element have all of
        // their children removed as part of the set - the entire subtree is
        // 'disassembled'. This work around walks the subtree *before* using the
        // native setter.
        /** @type {!Array<!Element>|undefined} */
        let removedElements = undefined;
        if (isConnected) {
          removedElements = [];
          __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["d" /* walkDeepDescendantElements */](this, element => {
            if (element !== this) {
              removedElements.push(element);
            }
          });
        }

        baseDescriptor.set.call(this, htmlString);

        if (removedElements) {
          for (let i = 0; i < removedElements.length; i++) {
            const element = removedElements[i];
            if (element.__CE_state === __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__["a" /* default */].custom) {
              internals.disconnectedCallback(element);
            }
          }
        }

        // Only create custom elements if this element's owner document is
        // associated with the registry.
        if (!this.ownerDocument.__CE_hasRegistry) {
          internals.patchTree(this);
        } else {
          internals.patchAndUpgradeTree(this);
        }
        return htmlString;
      }
    });
  }

  if (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_innerHTML && __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_innerHTML.get) {
    patch_innerHTML(Element.prototype, __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_innerHTML);
  } else if (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].HTMLElement_innerHTML && __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].HTMLElement_innerHTML.get) {
    patch_innerHTML(HTMLElement.prototype, __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].HTMLElement_innerHTML);
  } else {

    /** @type {HTMLDivElement} */
    const rawDiv = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_createElement.call(document, 'div');

    internals.addPatch(function (element) {
      patch_innerHTML(element, {
        enumerable: true,
        configurable: true,
        // Implements getting `innerHTML` by performing an unpatched `cloneNode`
        // of the element and returning the resulting element's `innerHTML`.
        // TODO: Is this too expensive?
        get: /** @this {Element} */function () {
          return __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_cloneNode.call(this, true).innerHTML;
        },
        // Implements setting `innerHTML` by creating an unpatched element,
        // setting `innerHTML` of that element and replacing the target
        // element's children with those of the unpatched element.
        set: /** @this {Element} */function (assignedValue) {
          // NOTE: re-route to `content` for `template` elements.
          // We need to do this because `template.appendChild` does not
          // route into `template.content`.
          /** @type {!Node} */
          const content = this.localName === 'template' ? /** @type {!HTMLTemplateElement} */this.content : this;
          rawDiv.innerHTML = assignedValue;

          while (content.childNodes.length > 0) {
            __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_removeChild.call(content, content.childNodes[0]);
          }
          while (rawDiv.childNodes.length > 0) {
            __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_appendChild.call(content, rawDiv.childNodes[0]);
          }
        }
      });
    });
  }

  __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["b" /* setPropertyUnchecked */](Element.prototype, 'setAttribute',
  /**
   * @this {Element}
   * @param {string} name
   * @param {string} newValue
   */
  function (name, newValue) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__["a" /* default */].custom) {
      return __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_setAttribute.call(this, name, newValue);
    }

    const oldValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttribute.call(this, name);
    __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_setAttribute.call(this, name, newValue);
    newValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttribute.call(this, name);
    internals.attributeChangedCallback(this, name, oldValue, newValue, null);
  });

  __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["b" /* setPropertyUnchecked */](Element.prototype, 'setAttributeNS',
  /**
   * @this {Element}
   * @param {?string} namespace
   * @param {string} name
   * @param {string} newValue
   */
  function (namespace, name, newValue) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__["a" /* default */].custom) {
      return __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_setAttributeNS.call(this, namespace, name, newValue);
    }

    const oldValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttributeNS.call(this, namespace, name);
    __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_setAttributeNS.call(this, namespace, name, newValue);
    newValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttributeNS.call(this, namespace, name);
    internals.attributeChangedCallback(this, name, oldValue, newValue, namespace);
  });

  __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["b" /* setPropertyUnchecked */](Element.prototype, 'removeAttribute',
  /**
   * @this {Element}
   * @param {string} name
   */
  function (name) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__["a" /* default */].custom) {
      return __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_removeAttribute.call(this, name);
    }

    const oldValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttribute.call(this, name);
    __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_removeAttribute.call(this, name);
    if (oldValue !== null) {
      internals.attributeChangedCallback(this, name, oldValue, null, null);
    }
  });

  __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["b" /* setPropertyUnchecked */](Element.prototype, 'removeAttributeNS',
  /**
   * @this {Element}
   * @param {?string} namespace
   * @param {string} name
   */
  function (namespace, name) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__["a" /* default */].custom) {
      return __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_removeAttributeNS.call(this, namespace, name);
    }

    const oldValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttributeNS.call(this, namespace, name);
    __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_removeAttributeNS.call(this, namespace, name);
    // In older browsers, `Element#getAttributeNS` may return the empty string
    // instead of null if the attribute does not exist. For details, see;
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNS#Notes
    const newValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttributeNS.call(this, namespace, name);
    if (oldValue !== newValue) {
      internals.attributeChangedCallback(this, name, oldValue, newValue, namespace);
    }
  });

  function patch_insertAdjacentElement(destination, baseMethod) {
    __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["b" /* setPropertyUnchecked */](destination, 'insertAdjacentElement',
    /**
     * @this {Element}
     * @param {string} where
     * @param {!Element} element
     * @return {?Element}
     */
    function (where, element) {
      const wasConnected = __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["c" /* isConnected */](element);
      const insertedElement = /** @type {!Element} */
      baseMethod.call(this, where, element);

      if (wasConnected) {
        internals.disconnectTree(element);
      }

      if (__WEBPACK_IMPORTED_MODULE_3__Utilities_js__["c" /* isConnected */](insertedElement)) {
        internals.connectTree(element);
      }
      return insertedElement;
    });
  }

  if (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].HTMLElement_insertAdjacentElement) {
    patch_insertAdjacentElement(HTMLElement.prototype, __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].HTMLElement_insertAdjacentElement);
  } else if (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_insertAdjacentElement) {
    patch_insertAdjacentElement(Element.prototype, __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_insertAdjacentElement);
  } else {
    console.warn('Custom Elements: `Element#insertAdjacentElement` was not patched.');
  }

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__Interface_ParentNode_js__["a" /* default */])(internals, Element.prototype, {
    prepend: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_prepend,
    append: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_append
  });

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__Interface_ChildNode_js__["a" /* default */])(internals, Element.prototype, {
    before: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_before,
    after: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_after,
    replaceWith: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_replaceWith,
    remove: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_remove
  });
});;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/HTMLElement.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Native_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CustomElementInternals_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementState.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__AlreadyConstructedMarker_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/AlreadyConstructedMarker.js");





/**
 * @param {!CustomElementInternals} internals
 */
/* harmony default export */ __webpack_exports__["a"] = (function (internals) {
  window['HTMLElement'] = function () {
    /**
     * @type {function(new: HTMLElement): !HTMLElement}
     */
    function HTMLElement() {
      // This should really be `new.target` but `new.target` can't be emulated
      // in ES5. Assuming the user keeps the default value of the constructor's
      // prototype's `constructor` property, this is equivalent.
      /** @type {!Function} */
      const constructor = this.constructor;

      const definition = internals.constructorToDefinition(constructor);
      if (!definition) {
        throw new Error('The custom element being constructed was not registered with `customElements`.');
      }

      const constructionStack = definition.constructionStack;

      if (constructionStack.length === 0) {
        const element = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_createElement.call(document, definition.localName);
        Object.setPrototypeOf(element, constructor.prototype);
        element.__CE_state = __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__["a" /* default */].custom;
        element.__CE_definition = definition;
        internals.patch(element);
        return element;
      }

      const lastIndex = constructionStack.length - 1;
      const element = constructionStack[lastIndex];
      if (element === __WEBPACK_IMPORTED_MODULE_3__AlreadyConstructedMarker_js__["a" /* default */]) {
        throw new Error('The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.');
      }
      constructionStack[lastIndex] = __WEBPACK_IMPORTED_MODULE_3__AlreadyConstructedMarker_js__["a" /* default */];

      Object.setPrototypeOf(element, constructor.prototype);
      internals.patch( /** @type {!HTMLElement} */element);

      return element;
    }

    HTMLElement.prototype = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].HTMLElement.prototype;

    return HTMLElement;
  }();
});;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ChildNode.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CustomElementInternals_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utilities_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");



/**
 * @typedef {{
 *   before: !function(...(!Node|string)),
 *   after: !function(...(!Node|string)),
 *   replaceWith: !function(...(!Node|string)),
 *   remove: !function(),
 * }}
 */
let ChildNodeNativeMethods;

/**
 * @param {!CustomElementInternals} internals
 * @param {!Object} destination
 * @param {!ChildNodeNativeMethods} builtIn
 */
/* harmony default export */ __webpack_exports__["a"] = (function (internals, destination, builtIn) {
  /**
   * @param {...(!Node|string)} nodes
   */
  destination['before'] = function (...nodes) {
    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    const connectedBefore = /** @type {!Array<!Node>} */nodes.filter(node => {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["c" /* isConnected */](node);
    });

    builtIn.before.apply(this, nodes);

    for (let i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (__WEBPACK_IMPORTED_MODULE_1__Utilities_js__["c" /* isConnected */](this)) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['after'] = function (...nodes) {
    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    const connectedBefore = /** @type {!Array<!Node>} */nodes.filter(node => {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["c" /* isConnected */](node);
    });

    builtIn.after.apply(this, nodes);

    for (let i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (__WEBPACK_IMPORTED_MODULE_1__Utilities_js__["c" /* isConnected */](this)) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['replaceWith'] = function (...nodes) {
    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    const connectedBefore = /** @type {!Array<!Node>} */nodes.filter(node => {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["c" /* isConnected */](node);
    });

    const wasConnected = __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["c" /* isConnected */](this);

    builtIn.replaceWith.apply(this, nodes);

    for (let i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (wasConnected) {
      internals.disconnectTree(this);
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  destination['remove'] = function () {
    const wasConnected = __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["c" /* isConnected */](this);

    builtIn.remove.call(this);

    if (wasConnected) {
      internals.disconnectTree(this);
    }
  };
});;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ParentNode.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CustomElementInternals_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utilities_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");



/**
 * @typedef {{
 *   prepend: !function(...(!Node|string)),
  *  append: !function(...(!Node|string)),
 * }}
 */
let ParentNodeNativeMethods;

/**
 * @param {!CustomElementInternals} internals
 * @param {!Object} destination
 * @param {!ParentNodeNativeMethods} builtIn
 */
/* harmony default export */ __webpack_exports__["a"] = (function (internals, destination, builtIn) {
  /**
   * @param {...(!Node|string)} nodes
   */
  destination['prepend'] = function (...nodes) {
    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    const connectedBefore = /** @type {!Array<!Node>} */nodes.filter(node => {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["c" /* isConnected */](node);
    });

    builtIn.prepend.apply(this, nodes);

    for (let i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (__WEBPACK_IMPORTED_MODULE_1__Utilities_js__["c" /* isConnected */](this)) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['append'] = function (...nodes) {
    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    const connectedBefore = /** @type {!Array<!Node>} */nodes.filter(node => {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["c" /* isConnected */](node);
    });

    builtIn.append.apply(this, nodes);

    for (let i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (__WEBPACK_IMPORTED_MODULE_1__Utilities_js__["c" /* isConnected */](this)) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };
});;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Native.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  Document_createElement: window.Document.prototype.createElement,
  Document_createElementNS: window.Document.prototype.createElementNS,
  Document_importNode: window.Document.prototype.importNode,
  Document_prepend: window.Document.prototype['prepend'],
  Document_append: window.Document.prototype['append'],
  Node_cloneNode: window.Node.prototype.cloneNode,
  Node_appendChild: window.Node.prototype.appendChild,
  Node_insertBefore: window.Node.prototype.insertBefore,
  Node_removeChild: window.Node.prototype.removeChild,
  Node_replaceChild: window.Node.prototype.replaceChild,
  Node_textContent: Object.getOwnPropertyDescriptor(window.Node.prototype, 'textContent'),
  Element_attachShadow: window.Element.prototype['attachShadow'],
  Element_innerHTML: Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML'),
  Element_getAttribute: window.Element.prototype.getAttribute,
  Element_setAttribute: window.Element.prototype.setAttribute,
  Element_removeAttribute: window.Element.prototype.removeAttribute,
  Element_getAttributeNS: window.Element.prototype.getAttributeNS,
  Element_setAttributeNS: window.Element.prototype.setAttributeNS,
  Element_removeAttributeNS: window.Element.prototype.removeAttributeNS,
  Element_insertAdjacentElement: window.Element.prototype['insertAdjacentElement'],
  Element_prepend: window.Element.prototype['prepend'],
  Element_append: window.Element.prototype['append'],
  Element_before: window.Element.prototype['before'],
  Element_after: window.Element.prototype['after'],
  Element_replaceWith: window.Element.prototype['replaceWith'],
  Element_remove: window.Element.prototype['remove'],
  HTMLElement: window.HTMLElement,
  HTMLElement_innerHTML: Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML'),
  HTMLElement_insertAdjacentElement: window.HTMLElement.prototype['insertAdjacentElement']
});

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Node.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Native_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CustomElementInternals_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Utilities_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");




/**
 * @param {!CustomElementInternals} internals
 */
/* harmony default export */ __webpack_exports__["a"] = (function (internals) {
  // `Node#nodeValue` is implemented on `Attr`.
  // `Node#textContent` is implemented on `Attr`, `Element`.

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["b" /* setPropertyUnchecked */](Node.prototype, 'insertBefore',
  /**
   * @this {Node}
   * @param {!Node} node
   * @param {?Node} refNode
   * @return {!Node}
   */
  function (node, refNode) {
    if (node instanceof DocumentFragment) {
      const insertedNodes = Array.prototype.slice.apply(node.childNodes);
      const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_insertBefore.call(this, node, refNode);

      // DocumentFragments can't be connected, so `disconnectTree` will never
      // need to be called on a DocumentFragment's children after inserting it.

      if (__WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* isConnected */](this)) {
        for (let i = 0; i < insertedNodes.length; i++) {
          internals.connectTree(insertedNodes[i]);
        }
      }

      return nativeResult;
    }

    const nodeWasConnected = __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* isConnected */](node);
    const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_insertBefore.call(this, node, refNode);

    if (nodeWasConnected) {
      internals.disconnectTree(node);
    }

    if (__WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* isConnected */](this)) {
      internals.connectTree(node);
    }

    return nativeResult;
  });

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["b" /* setPropertyUnchecked */](Node.prototype, 'appendChild',
  /**
   * @this {Node}
   * @param {!Node} node
   * @return {!Node}
   */
  function (node) {
    if (node instanceof DocumentFragment) {
      const insertedNodes = Array.prototype.slice.apply(node.childNodes);
      const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_appendChild.call(this, node);

      // DocumentFragments can't be connected, so `disconnectTree` will never
      // need to be called on a DocumentFragment's children after inserting it.

      if (__WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* isConnected */](this)) {
        for (let i = 0; i < insertedNodes.length; i++) {
          internals.connectTree(insertedNodes[i]);
        }
      }

      return nativeResult;
    }

    const nodeWasConnected = __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* isConnected */](node);
    const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_appendChild.call(this, node);

    if (nodeWasConnected) {
      internals.disconnectTree(node);
    }

    if (__WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* isConnected */](this)) {
      internals.connectTree(node);
    }

    return nativeResult;
  });

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["b" /* setPropertyUnchecked */](Node.prototype, 'cloneNode',
  /**
   * @this {Node}
   * @param {boolean=} deep
   * @return {!Node}
   */
  function (deep) {
    const clone = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_cloneNode.call(this, deep);
    // Only create custom elements if this element's owner document is
    // associated with the registry.
    if (!this.ownerDocument.__CE_hasRegistry) {
      internals.patchTree(clone);
    } else {
      internals.patchAndUpgradeTree(clone);
    }
    return clone;
  });

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["b" /* setPropertyUnchecked */](Node.prototype, 'removeChild',
  /**
   * @this {Node}
   * @param {!Node} node
   * @return {!Node}
   */
  function (node) {
    const nodeWasConnected = __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* isConnected */](node);
    const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_removeChild.call(this, node);

    if (nodeWasConnected) {
      internals.disconnectTree(node);
    }

    return nativeResult;
  });

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["b" /* setPropertyUnchecked */](Node.prototype, 'replaceChild',
  /**
   * @this {Node}
   * @param {!Node} nodeToInsert
   * @param {!Node} nodeToRemove
   * @return {!Node}
   */
  function (nodeToInsert, nodeToRemove) {
    if (nodeToInsert instanceof DocumentFragment) {
      const insertedNodes = Array.prototype.slice.apply(nodeToInsert.childNodes);
      const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_replaceChild.call(this, nodeToInsert, nodeToRemove);

      // DocumentFragments can't be connected, so `disconnectTree` will never
      // need to be called on a DocumentFragment's children after inserting it.

      if (__WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* isConnected */](this)) {
        internals.disconnectTree(nodeToRemove);
        for (let i = 0; i < insertedNodes.length; i++) {
          internals.connectTree(insertedNodes[i]);
        }
      }

      return nativeResult;
    }

    const nodeToInsertWasConnected = __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* isConnected */](nodeToInsert);
    const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_replaceChild.call(this, nodeToInsert, nodeToRemove);
    const thisIsConnected = __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* isConnected */](this);

    if (thisIsConnected) {
      internals.disconnectTree(nodeToRemove);
    }

    if (nodeToInsertWasConnected) {
      internals.disconnectTree(nodeToInsert);
    }

    if (thisIsConnected) {
      internals.connectTree(nodeToInsert);
    }

    return nativeResult;
  });

  function patch_textContent(destination, baseDescriptor) {
    Object.defineProperty(destination, 'textContent', {
      enumerable: baseDescriptor.enumerable,
      configurable: true,
      get: baseDescriptor.get,
      set: /** @this {Node} */function (assignedValue) {
        // If this is a text node then there are no nodes to disconnect.
        if (this.nodeType === Node.TEXT_NODE) {
          baseDescriptor.set.call(this, assignedValue);
          return;
        }

        let removedNodes = undefined;
        // Checking for `firstChild` is faster than reading `childNodes.length`
        // to compare with 0.
        if (this.firstChild) {
          // Using `childNodes` is faster than `children`, even though we only
          // care about elements.
          const childNodes = this.childNodes;
          const childNodesLength = childNodes.length;
          if (childNodesLength > 0 && __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* isConnected */](this)) {
            // Copying an array by iterating is faster than using slice.
            removedNodes = new Array(childNodesLength);
            for (let i = 0; i < childNodesLength; i++) {
              removedNodes[i] = childNodes[i];
            }
          }
        }

        baseDescriptor.set.call(this, assignedValue);

        if (removedNodes) {
          for (let i = 0; i < removedNodes.length; i++) {
            internals.disconnectTree(removedNodes[i]);
          }
        }
      }
    });
  }

  if (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_textContent && __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_textContent.get) {
    patch_textContent(Node.prototype, __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_textContent);
  } else {
    internals.addPatch(function (element) {
      patch_textContent(element, {
        enumerable: true,
        configurable: true,
        // NOTE: This implementation of the `textContent` getter assumes that
        // text nodes' `textContent` getter will not be patched.
        get: /** @this {Node} */function () {
          /** @type {!Array<string>} */
          const parts = [];

          for (let i = 0; i < this.childNodes.length; i++) {
            parts.push(this.childNodes[i].textContent);
          }

          return parts.join('');
        },
        set: /** @this {Node} */function (assignedValue) {
          while (this.firstChild) {
            __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_removeChild.call(this, this.firstChild);
          }
          __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_appendChild.call(this, document.createTextNode(assignedValue));
        }
      });
    });
  }
});;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Utilities.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isValidCustomElementName;
/* harmony export (immutable) */ __webpack_exports__["c"] = isConnected;
/* harmony export (immutable) */ __webpack_exports__["d"] = walkDeepDescendantElements;
/* harmony export (immutable) */ __webpack_exports__["b"] = setPropertyUnchecked;
const reservedTagList = new Set(['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph']);

/**
 * @param {string} localName
 * @returns {boolean}
 */
function isValidCustomElementName(localName) {
  const reserved = reservedTagList.has(localName);
  const validForm = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(localName);
  return !reserved && validForm;
}

/**
 * @private
 * @param {!Node} node
 * @return {boolean}
 */
function isConnected(node) {
  // Use `Node#isConnected`, if defined.
  const nativeValue = node.isConnected;
  if (nativeValue !== undefined) {
    return nativeValue;
  }

  /** @type {?Node|undefined} */
  let current = node;
  while (current && !(current.__CE_isImportDocument || current instanceof Document)) {
    current = current.parentNode || (window.ShadowRoot && current instanceof ShadowRoot ? current.host : undefined);
  }
  return !!(current && (current.__CE_isImportDocument || current instanceof Document));
}

/**
 * @param {!Node} root
 * @param {!Node} start
 * @return {?Node}
 */
function nextSiblingOrAncestorSibling(root, start) {
  let node = start;
  while (node && node !== root && !node.nextSibling) {
    node = node.parentNode;
  }
  return !node || node === root ? null : node.nextSibling;
}

/**
 * @param {!Node} root
 * @param {!Node} start
 * @return {?Node}
 */
function nextNode(root, start) {
  return start.firstChild ? start.firstChild : nextSiblingOrAncestorSibling(root, start);
}

/**
 * @param {!Node} root
 * @param {!function(!Element)} callback
 * @param {!Set<Node>=} visitedImports
 */
function walkDeepDescendantElements(root, callback, visitedImports = new Set()) {
  let node = root;
  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = /** @type {!Element} */node;

      callback(element);

      const localName = element.localName;
      if (localName === 'link' && element.getAttribute('rel') === 'import') {
        // If this import (polyfilled or not) has it's root node available,
        // walk it.
        const importNode = /** @type {!Node} */element.import;
        if (importNode instanceof Node && !visitedImports.has(importNode)) {
          // Prevent multiple walks of the same import root.
          visitedImports.add(importNode);

          for (let child = importNode.firstChild; child; child = child.nextSibling) {
            walkDeepDescendantElements(child, callback, visitedImports);
          }
        }

        // Ignore descendants of import links to prevent attempting to walk the
        // elements created by the HTML Imports polyfill that we just walked
        // above.
        node = nextSiblingOrAncestorSibling(root, element);
        continue;
      } else if (localName === 'template') {
        // Ignore descendants of templates. There shouldn't be any descendants
        // because they will be moved into `.content` during construction in
        // browsers that support template but, in case they exist and are still
        // waiting to be moved by a polyfill, they will be ignored.
        node = nextSiblingOrAncestorSibling(root, element);
        continue;
      }

      // Walk shadow roots.
      const shadowRoot = element.__CE_shadowRoot;
      if (shadowRoot) {
        for (let child = shadowRoot.firstChild; child; child = child.nextSibling) {
          walkDeepDescendantElements(child, callback, visitedImports);
        }
      }
    }

    node = nextNode(root, node);
  }
}

/**
 * Used to suppress Closure's "Modifying the prototype is only allowed if the
 * constructor is in the same scope" warning without using
 * `@suppress {newCheckTypes, duplicate}` because `newCheckTypes` is too broad.
 *
 * @param {!Object} destination
 * @param {string} name
 * @param {*} value
 */
function setPropertyUnchecked(destination, name, value) {
  destination[name] = value;
}

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/custom-elements.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CustomElementInternals_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CustomElementRegistry_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementRegistry.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Patch_HTMLElement_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/HTMLElement.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Patch_Document_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Document.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Patch_Node_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Node.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Patch_Element_js__ = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Element.js");
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */









const priorCustomElements = window['customElements'];

if (!priorCustomElements || priorCustomElements['forcePolyfill'] || typeof priorCustomElements['define'] != 'function' || typeof priorCustomElements['get'] != 'function') {
  /** @type {!CustomElementInternals} */
  const internals = new __WEBPACK_IMPORTED_MODULE_0__CustomElementInternals_js__["a" /* default */]();

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Patch_HTMLElement_js__["a" /* default */])(internals);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__Patch_Document_js__["a" /* default */])(internals);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__Patch_Node_js__["a" /* default */])(internals);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__Patch_Element_js__["a" /* default */])(internals);

  // The main document is always associated with the registry.
  document.__CE_hasRegistry = true;

  /** @type {!CustomElementRegistry} */
  const customElements = new __WEBPACK_IMPORTED_MODULE_1__CustomElementRegistry_js__["a" /* default */](internals);

  Object.defineProperty(window, 'customElements', {
    configurable: true,
    enumerable: true,
    value: customElements
  });
}

/***/ }),

/***/ "../node_modules/array.from/implementation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ES = __webpack_require__("../node_modules/es-abstract/es6.js");
var supportsDescriptors = __webpack_require__("../node_modules/define-properties/index.js").supportsDescriptors;

/*! https://mths.be/array-from v0.2.0 by @mathias */
module.exports = function from(arrayLike) {
	var defineProperty = supportsDescriptors ? Object.defineProperty : function put(object, key, descriptor) {
		object[key] = descriptor.value;
	};
	var C = this;
	if (arrayLike === null || typeof arrayLike === 'undefined') {
		throw new TypeError('`Array.from` requires an array-like object, not `null` or `undefined`');
	}
	var items = ES.ToObject(arrayLike);

	var mapFn, T;
	if (typeof arguments[1] !== 'undefined') {
		mapFn = arguments[1];
		if (!ES.IsCallable(mapFn)) {
			throw new TypeError('When provided, the second argument to `Array.from` must be a function');
		}
		if (arguments.length > 2) {
			T = arguments[2];
		}
	}

	var len = ES.ToLength(items.length);
	var A = ES.IsCallable(C) ? ES.ToObject(new C(len)) : new Array(len);
	var k = 0;
	var kValue, mappedValue;
	while (k < len) {
		kValue = items[k];
		if (mapFn) {
			mappedValue = typeof T === 'undefined' ? mapFn(kValue, k) : ES.Call(mapFn, T, [kValue, k]);
		} else {
			mappedValue = kValue;
		}
		defineProperty(A, k, {
			'configurable': true,
			'enumerable': true,
			'value': mappedValue,
			'writable': true
		});
		k += 1;
	}
	A.length = len;
	return A;
};

/***/ }),

/***/ "../node_modules/array.from/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__("../node_modules/define-properties/index.js");

var implementation = __webpack_require__("../node_modules/array.from/implementation.js");
var getPolyfill = __webpack_require__("../node_modules/array.from/polyfill.js");
var shim = __webpack_require__("../node_modules/array.from/shim.js");

// eslint-disable-next-line no-unused-vars
var boundFromShim = function from(array) {
	// eslint-disable-next-line no-invalid-this
	return implementation.apply(this || Array, arguments);
};

define(boundFromShim, {
	'getPolyfill': getPolyfill,
	'implementation': implementation,
	'shim': shim
});

module.exports = boundFromShim;

/***/ }),

/***/ "../node_modules/array.from/polyfill.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ES = __webpack_require__("../node_modules/es-abstract/es6.js");
var implementation = __webpack_require__("../node_modules/array.from/implementation.js");

var tryCall = function (fn) {
	try {
		fn();
		return true;
	} catch (e) {
		return false;
	}
};

module.exports = function getPolyfill() {
	var implemented = ES.IsCallable(Array.from) && tryCall(function () {
		Array.from({ 'length': -Infinity });
	}) && !tryCall(function () {
		Array.from([], undefined);
	});

	return implemented ? Array.from : implementation;
};

/***/ }),

/***/ "../node_modules/array.from/shim.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__("../node_modules/define-properties/index.js");
var getPolyfill = __webpack_require__("../node_modules/array.from/polyfill.js");

module.exports = function shimArrayFrom() {
	var polyfill = getPolyfill();

	define(Array, { 'from': polyfill }, {
		'from': function () {
			return Array.from !== polyfill;
		}
	});

	return polyfill;
};

/***/ }),

/***/ "../node_modules/css-loader/index.js!../node_modules/stylus-loader/index.js!../node_modules/zwip-player/src/zwip-player.styl":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "* {\n  box-sizing: border-box;\n}\nzwip-player {\n  position: absolute;\n  bottom: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n}\nzwip-player h3 {\n  margin-top: 2em;\n}\nzwip-player h3:first-child {\n  margin-top: 0;\n}\nzwip-player pre {\n  font-size: 12px;\n  display: inline;\n  padding-left: 10px;\n}\nzwip-player .scene {\n  position: absolute;\n  bottom: 50px;\n  top: 0;\n  left: 0;\n  right: 0;\n  background-color: #b9b9b9;\n  overflow: auto;\n}\nzwip-player .left {\n  position: absolute;\n  bottom: 0;\n  top: 0;\n  left: 0;\n  right: 210px;\n}\nzwip-player .toolbar {\n  position: absolute;\n  bottom: 0;\n  top: initial;\n  left: 0;\n  right: 0;\n  background-color: #505050;\n  padding: 6px;\n  height: 50px;\n  display: flex;\n}\nzwip-player .right {\n  position: absolute;\n  bottom: 0;\n  top: 0;\n  left: initial;\n  right: 0;\n  color: #b9b9b9;\n  width: 210px;\n  background-color: #505050;\n  margin: 0;\n}\nzwip-player .right > :first-child {\n  margin-top: 50px;\n  padding: 12px;\n}\nzwip-player .right .toolbar {\n  position: absolute;\n  bottom: initial;\n  top: 0;\n  left: 0;\n  right: 0;\n}\nzwip-player button {\n  width: 70px;\n  font-size: 22px;\n  margin-right: 6px;\n  background-color: #b9b9b9;\n  color: #505050;\n  border: none;\n}\nzwip-player button:last-child {\n  margin-right: 0;\n}\nzwip-player button:disabled {\n  background-color: #505050;\n  color: #b9b9b9;\n}\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),

/***/ "../node_modules/define-properties/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keys = __webpack_require__("../node_modules/object-keys/index.js");
var foreach = __webpack_require__("../node_modules/foreach/index.js");
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
		/* eslint-disable no-unused-vars, no-restricted-syntax */
		for (var _ in obj) {
			return false;
		}
		/* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) {
		/* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

/***/ }),

/***/ "../node_modules/es-abstract/es5.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $isNaN = __webpack_require__("../node_modules/es-abstract/helpers/isNaN.js");
var $isFinite = __webpack_require__("../node_modules/es-abstract/helpers/isFinite.js");

var sign = __webpack_require__("../node_modules/es-abstract/helpers/sign.js");
var mod = __webpack_require__("../node_modules/es-abstract/helpers/mod.js");

var IsCallable = __webpack_require__("../node_modules/is-callable/index.js");
var toPrimitive = __webpack_require__("../node_modules/es-to-primitive/es5.js");

// https://es5.github.io/#x9
var ES5 = {
	ToPrimitive: toPrimitive,

	ToBoolean: function ToBoolean(value) {
		return Boolean(value);
	},
	ToNumber: function ToNumber(value) {
		return Number(value);
	},
	ToInteger: function ToInteger(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number)) {
			return 0;
		}
		if (number === 0 || !$isFinite(number)) {
			return number;
		}
		return sign(number) * Math.floor(Math.abs(number));
	},
	ToInt32: function ToInt32(x) {
		return this.ToNumber(x) >> 0;
	},
	ToUint32: function ToUint32(x) {
		return this.ToNumber(x) >>> 0;
	},
	ToUint16: function ToUint16(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) {
			return 0;
		}
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x10000);
	},
	ToString: function ToString(value) {
		return String(value);
	},
	ToObject: function ToObject(value) {
		this.CheckObjectCoercible(value);
		return Object(value);
	},
	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
		/* jshint eqnull:true */
		if (value == null) {
			throw new TypeError(optMessage || 'Cannot call method on ' + value);
		}
		return value;
	},
	IsCallable: IsCallable,
	SameValue: function SameValue(x, y) {
		if (x === y) {
			// 0 === -0, but they are not identical.
			if (x === 0) {
				return 1 / x === 1 / y;
			}
			return true;
		}
		return $isNaN(x) && $isNaN(y);
	},

	// http://www.ecma-international.org/ecma-262/5.1/#sec-8
	Type: function Type(x) {
		if (x === null) {
			return 'Null';
		}
		if (typeof x === 'undefined') {
			return 'Undefined';
		}
		if (typeof x === 'function' || typeof x === 'object') {
			return 'Object';
		}
		if (typeof x === 'number') {
			return 'Number';
		}
		if (typeof x === 'boolean') {
			return 'Boolean';
		}
		if (typeof x === 'string') {
			return 'String';
		}
	}
};

module.exports = ES5;

/***/ }),

/***/ "../node_modules/es-abstract/es6.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';
var symbolToStr = hasSymbols ? Symbol.prototype.toString : toStr;

var $isNaN = __webpack_require__("../node_modules/es-abstract/helpers/isNaN.js");
var $isFinite = __webpack_require__("../node_modules/es-abstract/helpers/isFinite.js");
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

var assign = __webpack_require__("../node_modules/es-abstract/helpers/assign.js");
var sign = __webpack_require__("../node_modules/es-abstract/helpers/sign.js");
var mod = __webpack_require__("../node_modules/es-abstract/helpers/mod.js");
var isPrimitive = __webpack_require__("../node_modules/es-abstract/helpers/isPrimitive.js");
var toPrimitive = __webpack_require__("../node_modules/es-to-primitive/es6.js");
var parseInteger = parseInt;
var bind = __webpack_require__("../node_modules/function-bind/index.js");
var strSlice = bind.call(Function.call, String.prototype.slice);
var isBinary = bind.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
var isOctal = bind.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
var hasNonWS = bind.call(Function.call, RegExp.prototype.test, nonWSregex);
var invalidHexLiteral = /^[-+]0x[0-9a-f]+$/i;
var isInvalidHexLiteral = bind.call(Function.call, RegExp.prototype.test, invalidHexLiteral);

// whitespace from: http://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = ['\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003', '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028', '\u2029\uFEFF'].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var replace = bind.call(Function.call, String.prototype.replace);
var trim = function (value) {
	return replace(value, trimRegex, '');
};

var ES5 = __webpack_require__("../node_modules/es-abstract/es5.js");

var hasRegExpMatcher = __webpack_require__("../node_modules/is-regex/index.js");

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
var ES6 = assign(assign({}, ES5), {

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
	Call: function Call(F, V) {
		var args = arguments.length > 2 ? arguments[2] : [];
		if (!this.IsCallable(F)) {
			throw new TypeError(F + ' is not a function');
		}
		return F.apply(V, args);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
	ToPrimitive: toPrimitive,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
	// ToBoolean: ES5.ToBoolean,

	// http://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
	ToNumber: function ToNumber(argument) {
		var value = isPrimitive(argument) ? argument : toPrimitive(argument, 'number');
		if (typeof value === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a number');
		}
		if (typeof value === 'string') {
			if (isBinary(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 2));
			} else if (isOctal(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 8));
			} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
				return NaN;
			} else {
				var trimmed = trim(value);
				if (trimmed !== value) {
					return this.ToNumber(trimmed);
				}
			}
		}
		return Number(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
	// ToInteger: ES5.ToNumber,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
	// ToInt32: ES5.ToInt32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
	// ToUint32: ES5.ToUint32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
	ToInt16: function ToInt16(argument) {
		var int16bit = this.ToUint16(argument);
		return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
	// ToUint16: ES5.ToUint16,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
	ToInt8: function ToInt8(argument) {
		var int8bit = this.ToUint8(argument);
		return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
	ToUint8: function ToUint8(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) {
			return 0;
		}
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x100);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
	ToUint8Clamp: function ToUint8Clamp(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number <= 0) {
			return 0;
		}
		if (number >= 0xFF) {
			return 0xFF;
		}
		var f = Math.floor(argument);
		if (f + 0.5 < number) {
			return f + 1;
		}
		if (number < f + 0.5) {
			return f;
		}
		if (f % 2 !== 0) {
			return f + 1;
		}
		return f;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
	ToString: function ToString(argument) {
		if (typeof argument === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a string');
		}
		return String(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
	ToObject: function ToObject(value) {
		this.RequireObjectCoercible(value);
		return Object(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
	ToPropertyKey: function ToPropertyKey(argument) {
		var key = this.ToPrimitive(argument, String);
		return typeof key === 'symbol' ? symbolToStr.call(key) : this.ToString(key);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	ToLength: function ToLength(argument) {
		var len = this.ToInteger(argument);
		if (len <= 0) {
			return 0;
		} // includes converting -0 to +0
		if (len > MAX_SAFE_INTEGER) {
			return MAX_SAFE_INTEGER;
		}
		return len;
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring
	CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
		if (toStr.call(argument) !== '[object String]') {
			throw new TypeError('must be a string');
		}
		if (argument === '-0') {
			return -0;
		}
		var n = this.ToNumber(argument);
		if (this.SameValue(this.ToString(n), argument)) {
			return n;
		}
		return void 0;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
	RequireObjectCoercible: ES5.CheckObjectCoercible,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
	IsArray: Array.isArray || function IsArray(argument) {
		return toStr.call(argument) === '[object Array]';
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
	// IsCallable: ES5.IsCallable,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
	IsConstructor: function IsConstructor(argument) {
		return typeof argument === 'function' && !!argument.prototype; // unfortunately there's no way to truly check this without try/catch `new argument`
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
	IsExtensible: function IsExtensible(obj) {
		if (!Object.preventExtensions) {
			return true;
		}
		if (isPrimitive(obj)) {
			return false;
		}
		return Object.isExtensible(obj);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
	IsInteger: function IsInteger(argument) {
		if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
			return false;
		}
		var abs = Math.abs(argument);
		return Math.floor(abs) === abs;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
	IsPropertyKey: function IsPropertyKey(argument) {
		return typeof argument === 'string' || typeof argument === 'symbol';
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-isregexp
	IsRegExp: function IsRegExp(argument) {
		if (!argument || typeof argument !== 'object') {
			return false;
		}
		if (hasSymbols) {
			var isRegExp = argument[Symbol.match];
			if (typeof isRegExp !== 'undefined') {
				return ES5.ToBoolean(isRegExp);
			}
		}
		return hasRegExpMatcher(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
	// SameValue: ES5.SameValue,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
	SameValueZero: function SameValueZero(x, y) {
		return x === y || $isNaN(x) && $isNaN(y);
	},

	/**
  * 7.3.2 GetV (V, P)
  * 1. Assert: IsPropertyKey(P) is true.
  * 2. Let O be ToObject(V).
  * 3. ReturnIfAbrupt(O).
  * 4. Return O.[[Get]](P, V).
  */
	GetV: function GetV(V, P) {
		// 7.3.2.1
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.2.2-3
		var O = this.ToObject(V);

		// 7.3.2.4
		return O[P];
	},

	/**
  * 7.3.9 - http://www.ecma-international.org/ecma-262/6.0/#sec-getmethod
  * 1. Assert: IsPropertyKey(P) is true.
  * 2. Let func be GetV(O, P).
  * 3. ReturnIfAbrupt(func).
  * 4. If func is either undefined or null, return undefined.
  * 5. If IsCallable(func) is false, throw a TypeError exception.
  * 6. Return func.
  */
	GetMethod: function GetMethod(O, P) {
		// 7.3.9.1
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.9.2
		var func = this.GetV(O, P);

		// 7.3.9.4
		if (func == null) {
			return undefined;
		}

		// 7.3.9.5
		if (!this.IsCallable(func)) {
			throw new TypeError(P + 'is not a function');
		}

		// 7.3.9.6
		return func;
	},

	/**
  * 7.3.1 Get (O, P) - http://www.ecma-international.org/ecma-262/6.0/#sec-get-o-p
  * 1. Assert: Type(O) is Object.
  * 2. Assert: IsPropertyKey(P) is true.
  * 3. Return O.[[Get]](P, O).
  */
	Get: function Get(O, P) {
		// 7.3.1.1
		if (this.Type(O) !== 'Object') {
			throw new TypeError('Assertion failed: Type(O) is not Object');
		}
		// 7.3.1.2
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}
		// 7.3.1.3
		return O[P];
	},

	Type: function Type(x) {
		if (typeof x === 'symbol') {
			return 'Symbol';
		}
		return ES5.Type(x);
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-speciesconstructor
	SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
		if (this.Type(O) !== 'Object') {
			throw new TypeError('Assertion failed: Type(O) is not Object');
		}
		var C = O.constructor;
		if (typeof C === 'undefined') {
			return defaultConstructor;
		}
		if (this.Type(C) !== 'Object') {
			throw new TypeError('O.constructor is not an Object');
		}
		var S = hasSymbols && Symbol.species ? C[Symbol.species] : undefined;
		if (S == null) {
			return defaultConstructor;
		}
		if (this.IsConstructor(S)) {
			return S;
		}
		throw new TypeError('no constructor found');
	}
});

delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

module.exports = ES6;

/***/ }),

/***/ "../node_modules/es-abstract/helpers/assign.js":
/***/ (function(module, exports) {

var has = Object.prototype.hasOwnProperty;
module.exports = Object.assign || function assign(target, source) {
	for (var key in source) {
		if (has.call(source, key)) {
			target[key] = source[key];
		}
	}
	return target;
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/isFinite.js":
/***/ (function(module, exports) {

var $isNaN = Number.isNaN || function (a) {
  return a !== a;
};

module.exports = Number.isFinite || function (x) {
  return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity;
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/isNaN.js":
/***/ (function(module, exports) {

module.exports = Number.isNaN || function isNaN(a) {
	return a !== a;
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/isPrimitive.js":
/***/ (function(module, exports) {

module.exports = function isPrimitive(value) {
	return value === null || typeof value !== 'function' && typeof value !== 'object';
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/mod.js":
/***/ (function(module, exports) {

module.exports = function mod(number, modulo) {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/sign.js":
/***/ (function(module, exports) {

module.exports = function sign(number) {
	return number >= 0 ? 1 : -1;
};

/***/ }),

/***/ "../node_modules/es-to-primitive/es5.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;

var isPrimitive = __webpack_require__("../node_modules/es-to-primitive/helpers/isPrimitive.js");

var isCallable = __webpack_require__("../node_modules/is-callable/index.js");

// https://es5.github.io/#x8.12
var ES5internalSlots = {
	'[[DefaultValue]]': function (O, hint) {
		var actualHint = hint || (toStr.call(O) === '[object Date]' ? String : Number);

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// https://es5.github.io/#x9
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
};

/***/ }),

/***/ "../node_modules/es-to-primitive/es6.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var isPrimitive = __webpack_require__("../node_modules/es-to-primitive/helpers/isPrimitive.js");
var isCallable = __webpack_require__("../node_modules/is-callable/index.js");
var isDate = __webpack_require__("../node_modules/is-date-object/index.js");
var isSymbol = __webpack_require__("../node_modules/is-symbol/index.js");

var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (typeof O === 'undefined' || O === null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || hint !== 'number' && hint !== 'string') {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (isCallable(method)) {
			result = method.call(O);
			if (isPrimitive(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};

var GetMethod = function GetMethod(O, P) {
	var func = O[P];
	if (func !== null && typeof func !== 'undefined') {
		if (!isCallable(func)) {
			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
		}
		return func;
	}
};

// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (PreferredType === String) {
			hint = 'string';
		} else if (PreferredType === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols) {
		if (Symbol.toPrimitive) {
			exoticToPrim = GetMethod(input, Symbol.toPrimitive);
		} else if (isSymbol(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (isDate(input) || isSymbol(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};

/***/ }),

/***/ "../node_modules/es-to-primitive/helpers/isPrimitive.js":
/***/ (function(module, exports) {

module.exports = function isPrimitive(value) {
	return value === null || typeof value !== 'function' && typeof value !== 'object';
};

/***/ }),

/***/ "../node_modules/es6-promise/dist/es6-promise.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {var require;/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.0
 */

(function (global, factory) {
   true ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.ES6Promise = factory();
})(this, function () {
  'use strict';

  function objectOrFunction(x) {
    return typeof x === 'function' || typeof x === 'object' && x !== null;
  }

  function isFunction(x) {
    return typeof x === 'function';
  }

  var _isArray = undefined;
  if (!Array.isArray) {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  } else {
    _isArray = Array.isArray;
  }

  var isArray = _isArray;

  var len = 0;
  var vertxNext = undefined;
  var customSchedulerFn = undefined;

  var asap = function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (customSchedulerFn) {
        customSchedulerFn(flush);
      } else {
        scheduleFlush();
      }
    }
  };

  function setScheduler(scheduleFn) {
    customSchedulerFn = scheduleFn;
  }

  function setAsap(asapFn) {
    asap = asapFn;
  }

  var browserWindow = typeof window !== 'undefined' ? window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  // test for web worker but not in IE10
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

  // node
  function useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      return process.nextTick(flush);
    };
  }

  // vertx
  function useVertxTimer() {
    if (typeof vertxNext !== 'undefined') {
      return function () {
        vertxNext(flush);
      };
    }

    return useSetTimeout();
  }

  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function () {
      node.data = iterations = ++iterations % 2;
    };
  }

  // web worker
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      return channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    // Store setTimeout reference so es6-promise will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var globalSetTimeout = setTimeout;
    return function () {
      return globalSetTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];

      callback(arg);

      queue[i] = undefined;
      queue[i + 1] = undefined;
    }

    len = 0;
  }

  function attemptVertx() {
    try {
      var r = require;
      var vertx = __webpack_require__(0);
      vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return useVertxTimer();
    } catch (e) {
      return useSetTimeout();
    }
  }

  var scheduleFlush = undefined;
  // Decide what async method to use to triggering processing of queued callbacks:
  if (isNode) {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else if (browserWindow === undefined && "function" === 'function') {
    scheduleFlush = attemptVertx();
  } else {
    scheduleFlush = useSetTimeout();
  }

  function then(onFulfillment, onRejection) {
    var _arguments = arguments;

    var parent = this;

    var child = new this.constructor(noop);

    if (child[PROMISE_ID] === undefined) {
      makePromise(child);
    }

    var _state = parent._state;

    if (_state) {
      (function () {
        var callback = _arguments[_state - 1];
        asap(function () {
          return invokeCallback(_state, child, callback, parent._result);
        });
      })();
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }

  /**
    `Promise.resolve` returns a promise that will become resolved with the
    passed `value`. It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      resolve(1);
    });
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.resolve(1);
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    @method resolve
    @static
    @param {Any} value value that the returned promise will be resolved with
    Useful for tooling.
    @return {Promise} a promise that will become fulfilled with the given
    `value`
  */
  function resolve(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && typeof object === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(noop);
    _resolve(promise, object);
    return promise;
  }

  var PROMISE_ID = Math.random().toString(36).substring(16);

  function noop() {}

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;

  var GET_THEN_ERROR = new ErrorObject();

  function selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function getThen(promise) {
    try {
      return promise.then;
    } catch (error) {
      GET_THEN_ERROR.error = error;
      return GET_THEN_ERROR;
    }
  }

  function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
    try {
      then.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function handleForeignThenable(promise, thenable, then) {
    asap(function (promise) {
      var sealed = false;
      var error = tryThen(then, thenable, function (value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          _resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }
        sealed = true;

        _reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;
        _reject(promise, error);
      }
    }, promise);
  }

  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === REJECTED) {
      _reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return _resolve(promise, value);
      }, function (reason) {
        return _reject(promise, reason);
      });
    }
  }

  function handleMaybeThenable(promise, maybeThenable, then$$) {
    if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      if (then$$ === GET_THEN_ERROR) {
        _reject(promise, GET_THEN_ERROR.error);
        GET_THEN_ERROR.error = null;
      } else if (then$$ === undefined) {
        fulfill(promise, maybeThenable);
      } else if (isFunction(then$$)) {
        handleForeignThenable(promise, maybeThenable, then$$);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }

  function _resolve(promise, value) {
    if (promise === value) {
      _reject(promise, selfFulfillment());
    } else if (objectOrFunction(value)) {
      handleMaybeThenable(promise, value, getThen(value));
    } else {
      fulfill(promise, value);
    }
  }

  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    publish(promise);
  }

  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._result = value;
    promise._state = FULFILLED;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }

  function _reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }
    promise._state = REJECTED;
    promise._result = reason;

    asap(publishRejection, promise);
  }

  function subscribe(parent, child, onFulfillment, onRejection) {
    var _subscribers = parent._subscribers;
    var length = _subscribers.length;

    parent._onerror = null;

    _subscribers[length] = child;
    _subscribers[length + FULFILLED] = onFulfillment;
    _subscribers[length + REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      asap(publish, parent);
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child = undefined,
        callback = undefined,
        detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function ErrorObject() {
    this.error = null;
  }

  var TRY_CATCH_ERROR = new ErrorObject();

  function tryCatch(callback, detail) {
    try {
      return callback(detail);
    } catch (e) {
      TRY_CATCH_ERROR.error = e;
      return TRY_CATCH_ERROR;
    }
  }

  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = isFunction(callback),
        value = undefined,
        error = undefined,
        succeeded = undefined,
        failed = undefined;

    if (hasCallback) {
      value = tryCatch(callback, detail);

      if (value === TRY_CATCH_ERROR) {
        failed = true;
        error = value.error;
        value.error = null;
      } else {
        succeeded = true;
      }

      if (promise === value) {
        _reject(promise, cannotReturnOwn());
        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }

    if (promise._state !== PENDING) {
      // noop
    } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
  }

  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        _resolve(promise, value);
      }, function rejectPromise(reason) {
        _reject(promise, reason);
      });
    } catch (e) {
      _reject(promise, e);
    }
  }

  var id = 0;
  function nextId() {
    return id++;
  }

  function makePromise(promise) {
    promise[PROMISE_ID] = id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this._input = input;
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate();
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      _reject(this.promise, validationError());
    }
  }

  function validationError() {
    return new Error('Array Methods must be provided an Array');
  };

  Enumerator.prototype._enumerate = function () {
    var length = this.length;
    var _input = this._input;

    for (var i = 0; this._state === PENDING && i < length; i++) {
      this._eachEntry(_input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function (entry, i) {
    var c = this._instanceConstructor;
    var resolve$$ = c.resolve;

    if (resolve$$ === resolve) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$) {
          return resolve$$(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function (state, i, value) {
    var promise = this.promise;

    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        _reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function (promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  /**
    `Promise.all` accepts an array of promises, and returns a new promise which
    is fulfilled with an array of fulfillment values for the passed promises, or
    rejected with the reason of the first passed promise to be rejected. It casts all
    elements of the passed iterable to promises as it runs this algorithm.
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = resolve(2);
    let promise3 = resolve(3);
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // The array here would be [ 1, 2, 3 ];
    });
    ```
  
    If any of the `promises` given to `all` are rejected, the first promise
    that is rejected will be given as an argument to the returned promises's
    rejection handler. For example:
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = reject(new Error("2"));
    let promise3 = reject(new Error("3"));
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // Code here never runs because there are rejected promises!
    }, function(error) {
      // error.message === "2"
    });
    ```
  
    @method all
    @static
    @param {Array} entries array of promises
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise} promise that is fulfilled when all `promises` have been
    fulfilled, or rejected if any of them become rejected.
    @static
  */
  function all(entries) {
    return new Enumerator(this, entries).promise;
  }

  /**
    `Promise.race` returns a new promise which is settled in the same way as the
    first passed promise to settle.
  
    Example:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 2');
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // result === 'promise 2' because it was resolved before promise1
      // was resolved.
    });
    ```
  
    `Promise.race` is deterministic in that only the state of the first
    settled promise matters. For example, even if other promises given to the
    `promises` array argument are resolved, but the first settled promise has
    become rejected before the other promises became fulfilled, the returned
    promise will become rejected:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        reject(new Error('promise 2'));
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // Code here never runs
    }, function(reason){
      // reason.message === 'promise 2' because promise 2 became rejected before
      // promise 1 became fulfilled
    });
    ```
  
    An example real-world use case is implementing timeouts:
  
    ```javascript
    Promise.race([ajax('foo.json'), timeout(5000)])
    ```
  
    @method race
    @static
    @param {Array} promises array of promises to observe
    Useful for tooling.
    @return {Promise} a promise which settles in the same way as the first passed
    promise to settle.
  */
  function race(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;
        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }

  /**
    `Promise.reject` returns a promise rejected with the passed `reason`.
    It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      reject(new Error('WHOOPS'));
    });
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.reject(new Error('WHOOPS'));
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    @method reject
    @static
    @param {Any} reason value that the returned promise will be rejected with.
    Useful for tooling.
    @return {Promise} a promise rejected with the given `reason`.
  */
  function reject(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(noop);
    _reject(promise, reason);
    return promise;
  }

  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  /**
    Promise objects represent the eventual result of an asynchronous operation. The
    primary way of interacting with a promise is through its `then` method, which
    registers callbacks to receive either a promise's eventual value or the reason
    why the promise cannot be fulfilled.
  
    Terminology
    -----------
  
    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
    - `thenable` is an object or function that defines a `then` method.
    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
    - `exception` is a value that is thrown using the throw statement.
    - `reason` is a value that indicates why a promise was rejected.
    - `settled` the final resting state of a promise, fulfilled or rejected.
  
    A promise can be in one of three states: pending, fulfilled, or rejected.
  
    Promises that are fulfilled have a fulfillment value and are in the fulfilled
    state.  Promises that are rejected have a rejection reason and are in the
    rejected state.  A fulfillment value is never a thenable.
  
    Promises can also be said to *resolve* a value.  If this value is also a
    promise, then the original promise's settled state will match the value's
    settled state.  So a promise that *resolves* a promise that rejects will
    itself reject, and a promise that *resolves* a promise that fulfills will
    itself fulfill.
  
  
    Basic Usage:
    ------------
  
    ```js
    let promise = new Promise(function(resolve, reject) {
      // on success
      resolve(value);
  
      // on failure
      reject(reason);
    });
  
    promise.then(function(value) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Advanced Usage:
    ---------------
  
    Promises shine when abstracting away asynchronous interactions such as
    `XMLHttpRequest`s.
  
    ```js
    function getJSON(url) {
      return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
  
        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
  
        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        };
      });
    }
  
    getJSON('/posts.json').then(function(json) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Unlike callbacks, promises are great composable primitives.
  
    ```js
    Promise.all([
      getJSON('/posts'),
      getJSON('/comments')
    ]).then(function(values){
      values[0] // => postsJSON
      values[1] // => commentsJSON
  
      return values;
    });
    ```
  
    @class Promise
    @param {function} resolver
    Useful for tooling.
    @constructor
  */
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  Promise.all = all;
  Promise.race = race;
  Promise.resolve = resolve;
  Promise.reject = reject;
  Promise._setScheduler = setScheduler;
  Promise._setAsap = setAsap;
  Promise._asap = asap;

  Promise.prototype = {
    constructor: Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.
    
      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```
    
      Chaining
      --------
    
      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.
    
      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });
    
      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
    
      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```
    
      Assimilation
      ------------
    
      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.
    
      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```
    
      If the assimliated promise rejects, then the downstream promise will also reject.
    
      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```
    
      Simple Example
      --------------
    
      Synchronous Example
    
      ```javascript
      let result;
    
      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```
    
      Errback Example
    
      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```
    
      Promise Example;
    
      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```
    
      Advanced Example
      --------------
    
      Synchronous Example
    
      ```javascript
      let author, books;
    
      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```
    
      Errback Example
    
      ```js
    
      function foundBooks(books) {
    
      }
    
      function failure(reason) {
    
      }
    
      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```
    
      Promise Example;
    
      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```
    
      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
    then: then,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.
    
      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }
    
      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }
    
      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```
    
      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
    'catch': function _catch(onRejection) {
      return this.then(null, onRejection);
    }
  };

  function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
      local = global;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P) {
      var promiseToString = null;
      try {
        promiseToString = Object.prototype.toString.call(P.resolve());
      } catch (e) {
        // silently ignored
      }

      if (promiseToString === '[object Promise]' && !P.cast) {
        return;
      }
    }

    local.Promise = Promise;
  }

  // Strange compat..
  Promise.polyfill = polyfill;
  Promise.Promise = Promise;

  return Promise;
});
//# sourceMappingURL=es6-promise.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/process/browser.js"), __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/foreach/index.js":
/***/ (function(module, exports) {


var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach(obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};

/***/ }),

/***/ "../node_modules/function-bind/implementation.js":
/***/ (function(module, exports) {

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(this, args.concat(slice.call(arguments)));
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(that, args.concat(slice.call(arguments)));
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

/***/ }),

/***/ "../node_modules/function-bind/index.js":
/***/ (function(module, exports, __webpack_require__) {

var implementation = __webpack_require__("../node_modules/function-bind/implementation.js");

module.exports = Function.prototype.bind || implementation;

/***/ }),

/***/ "../node_modules/has/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__("../node_modules/function-bind/index.js");

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

/***/ }),

/***/ "../node_modules/idom-util/src/button.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'button');

/***/ }),

/***/ "../node_modules/idom-util/src/div.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'div');

/***/ }),

/***/ "../node_modules/idom-util/src/element.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

exports.default = function (tagName) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var renderContent = args.pop();

  _incrementalDom.elementOpen.apply(undefined, [tagName].concat(args));
  typeof renderContent === 'function' && renderContent();
  (0, _incrementalDom.elementClose)(tagName);
};

/***/ }),

/***/ "../node_modules/idom-util/src/h3.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'h3');

/***/ }),

/***/ "../node_modules/idom-util/src/image.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

exports.default = function (src) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var key = args.shift();
  var staticProperties = args.shift();

  return _incrementalDom.elementVoid.apply(undefined, ['img', key, staticProperties, 'src', src].concat(args));
};

/***/ }),

/***/ "../node_modules/idom-util/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderH3 = exports.renderPre = exports.renderStrong = exports.renderStyle = exports.renderUl = exports.renderLi = exports.renderImage = exports.renderButton = exports.renderSpan = exports.renderDiv = exports.renderElement = undefined;

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

var _div = __webpack_require__("../node_modules/idom-util/src/div.js");

var _div2 = _interopRequireDefault(_div);

var _span = __webpack_require__("../node_modules/idom-util/src/span.js");

var _span2 = _interopRequireDefault(_span);

var _button = __webpack_require__("../node_modules/idom-util/src/button.js");

var _button2 = _interopRequireDefault(_button);

var _image = __webpack_require__("../node_modules/idom-util/src/image.js");

var _image2 = _interopRequireDefault(_image);

var _li = __webpack_require__("../node_modules/idom-util/src/li.js");

var _li2 = _interopRequireDefault(_li);

var _ul = __webpack_require__("../node_modules/idom-util/src/ul.js");

var _ul2 = _interopRequireDefault(_ul);

var _style = __webpack_require__("../node_modules/idom-util/src/style.js");

var _style2 = _interopRequireDefault(_style);

var _strong = __webpack_require__("../node_modules/idom-util/src/strong.js");

var _strong2 = _interopRequireDefault(_strong);

var _pre = __webpack_require__("../node_modules/idom-util/src/pre.js");

var _pre2 = _interopRequireDefault(_pre);

var _h = __webpack_require__("../node_modules/idom-util/src/h3.js");

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.renderElement = _element2.default;
exports.renderDiv = _div2.default;
exports.renderSpan = _span2.default;
exports.renderButton = _button2.default;
exports.renderImage = _image2.default;
exports.renderLi = _li2.default;
exports.renderUl = _ul2.default;
exports.renderStyle = _style2.default;
exports.renderStrong = _strong2.default;
exports.renderPre = _pre2.default;
exports.renderH3 = _h2.default;

/***/ }),

/***/ "../node_modules/idom-util/src/li.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'li');

/***/ }),

/***/ "../node_modules/idom-util/src/pre.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'pre');

/***/ }),

/***/ "../node_modules/idom-util/src/span.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'span');

/***/ }),

/***/ "../node_modules/idom-util/src/strong.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'strong');

/***/ }),

/***/ "../node_modules/idom-util/src/style.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (style) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return _element2.default.apply(undefined, ['style'].concat(args, [_incrementalDom.text.bind(null, style)]));
};

/***/ }),

/***/ "../node_modules/idom-util/src/ul.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'ul');

/***/ }),

/***/ "../node_modules/incremental-dom/dist/incremental-dom-cjs.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
/**
 * @license
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A cached reference to the hasOwnProperty function.
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * A constructor function that will create blank objects.
 * @constructor
 */
function Blank() {}

Blank.prototype = Object.create(null);

/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param {!Object<string, *>} map The map to check.
 * @param {string} property The property to check.
 * @return {boolean} Whether map has property.
 */
var has = function (map, property) {
  return hasOwnProperty.call(map, property);
};

/**
 * Creates an map object without a prototype.
 * @return {!Object}
 */
var createMap = function () {
  return new Blank();
};

/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 * @param {!string} nodeName
 * @param {?string=} key
 * @constructor
 */
function NodeData(nodeName, key) {
  /**
   * The attributes and their values.
   * @const {!Object<string, *>}
   */
  this.attrs = createMap();

  /**
   * An array of attribute name/value pairs, used for quickly diffing the
   * incomming attributes to see if the DOM node's attributes need to be
   * updated.
   * @const {Array<*>}
   */
  this.attrsArr = [];

  /**
   * The incoming attributes for this Node, before they are updated.
   * @const {!Object<string, *>}
   */
  this.newAttrs = createMap();

  /**
   * Whether or not the statics have been applied for the node yet.
   * {boolean}
   */
  this.staticsApplied = false;

  /**
   * The key used to identify this node, used to preserve DOM nodes when they
   * move within their parent.
   * @const
   */
  this.key = key;

  /**
   * Keeps track of children within this node by their key.
   * {!Object<string, !Element>}
   */
  this.keyMap = createMap();

  /**
   * Whether or not the keyMap is currently valid.
   * @type {boolean}
   */
  this.keyMapValid = true;

  /**
   * Whether or the associated node is, or contains, a focused Element.
   * @type {boolean}
   */
  this.focused = false;

  /**
   * The node name for this node.
   * @const {string}
   */
  this.nodeName = nodeName;

  /**
   * @type {?string}
   */
  this.text = null;
}

/**
 * Initializes a NodeData object for a Node.
 *
 * @param {Node} node The node to initialize data for.
 * @param {string} nodeName The node name of node.
 * @param {?string=} key The key that identifies the node.
 * @return {!NodeData} The newly initialized data object
 */
var initData = function (node, nodeName, key) {
  var data = new NodeData(nodeName, key);
  node['__incrementalDOMData'] = data;
  return data;
};

/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 *
 * @param {?Node} node The Node to retrieve the data for.
 * @return {!NodeData} The NodeData for this Node.
 */
var getData = function (node) {
  importNode(node);
  return node['__incrementalDOMData'];
};

/**
 * Imports node and its subtree, initializing caches.
 *
 * @param {?Node} node The Node to import.
 */
var importNode = function (node) {
  if (node['__incrementalDOMData']) {
    return;
  }

  var isElement = node instanceof Element;
  var nodeName = isElement ? node.localName : node.nodeName;
  var key = isElement ? node.getAttribute('key') : null;
  var data = initData(node, nodeName, key);

  if (key) {
    getData(node.parentNode).keyMap[key] = node;
  }

  if (isElement) {
    var attributes = node.attributes;
    var attrs = data.attrs;
    var newAttrs = data.newAttrs;
    var attrsArr = data.attrsArr;

    for (var i = 0; i < attributes.length; i += 1) {
      var attr = attributes[i];
      var name = attr.name;
      var value = attr.value;

      attrs[name] = value;
      newAttrs[name] = undefined;
      attrsArr.push(name);
      attrsArr.push(value);
    }
  }

  for (var child = node.firstChild; child; child = child.nextSibling) {
    importNode(child);
  }
};

/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @param {?Node} parent
 * @return {?string} The namespace to create the tag in.
 */
var getNamespaceForTag = function (tag, parent) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }

  if (getData(parent).nodeName === 'foreignObject') {
    return null;
  }

  return parent.namespaceURI;
};

/**
 * Creates an Element.
 * @param {Document} doc The document with which to create the Element.
 * @param {?Node} parent
 * @param {string} tag The tag for the Element.
 * @param {?string=} key A key to identify the Element.
 * @return {!Element}
 */
var createElement = function (doc, parent, tag, key) {
  var namespace = getNamespaceForTag(tag, parent);
  var el = undefined;

  if (namespace) {
    el = doc.createElementNS(namespace, tag);
  } else {
    el = doc.createElement(tag);
  }

  initData(el, tag, key);

  return el;
};

/**
 * Creates a Text Node.
 * @param {Document} doc The document with which to create the Element.
 * @return {!Text}
 */
var createText = function (doc) {
  var node = doc.createTextNode('');
  initData(node, '#text', null);
  return node;
};

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @const */
var notifications = {
  /**
   * Called after patch has compleated with any Nodes that have been created
   * and added to the DOM.
   * @type {?function(Array<!Node>)}
   */
  nodesCreated: null,

  /**
   * Called after patch has compleated with any Nodes that have been removed
   * from the DOM.
   * Note it's an applications responsibility to handle any childNodes.
   * @type {?function(Array<!Node>)}
   */
  nodesDeleted: null
};

/**
 * Keeps track of the state of a patch.
 * @constructor
 */
function Context() {
  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.created = notifications.nodesCreated && [];

  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.deleted = notifications.nodesDeleted && [];
}

/**
 * @param {!Node} node
 */
Context.prototype.markCreated = function (node) {
  if (this.created) {
    this.created.push(node);
  }
};

/**
 * @param {!Node} node
 */
Context.prototype.markDeleted = function (node) {
  if (this.deleted) {
    this.deleted.push(node);
  }
};

/**
 * Notifies about nodes that were created during the patch opearation.
 */
Context.prototype.notifyChanges = function () {
  if (this.created && this.created.length > 0) {
    notifications.nodesCreated(this.created);
  }

  if (this.deleted && this.deleted.length > 0) {
    notifications.nodesDeleted(this.deleted);
  }
};

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
  * Keeps track whether or not we are in an attributes declaration (after
  * elementOpenStart, but before elementOpenEnd).
  * @type {boolean}
  */
var inAttributes = false;

/**
  * Keeps track whether or not we are in an element that should not have its
  * children cleared.
  * @type {boolean}
  */
var inSkip = false;

/**
 * Makes sure that there is a current patch context.
 * @param {string} functionName
 * @param {*} context
 */
var assertInPatch = function (functionName, context) {
  if (!context) {
    throw new Error('Cannot call ' + functionName + '() unless in patch.');
  }
};

/**
 * Makes sure that a patch closes every node that it opened.
 * @param {?Node} openElement
 * @param {!Node|!DocumentFragment} root
 */
var assertNoUnclosedTags = function (openElement, root) {
  if (openElement === root) {
    return;
  }

  var currentElement = openElement;
  var openTags = [];
  while (currentElement && currentElement !== root) {
    openTags.push(currentElement.nodeName.toLowerCase());
    currentElement = currentElement.parentNode;
  }

  throw new Error('One or more tags were not closed:\n' + openTags.join('\n'));
};

/**
 * Makes sure that the caller is not where attributes are expected.
 * @param {string} functionName
 */
var assertNotInAttributes = function (functionName) {
  if (inAttributes) {
    throw new Error(functionName + '() can not be called between ' + 'elementOpenStart() and elementOpenEnd().');
  }
};

/**
 * Makes sure that the caller is not inside an element that has declared skip.
 * @param {string} functionName
 */
var assertNotInSkip = function (functionName) {
  if (inSkip) {
    throw new Error(functionName + '() may not be called inside an element ' + 'that has called skip().');
  }
};

/**
 * Makes sure that the caller is where attributes are expected.
 * @param {string} functionName
 */
var assertInAttributes = function (functionName) {
  if (!inAttributes) {
    throw new Error(functionName + '() can only be called after calling ' + 'elementOpenStart().');
  }
};

/**
 * Makes sure the patch closes virtual attributes call
 */
var assertVirtualAttributesClosed = function () {
  if (inAttributes) {
    throw new Error('elementOpenEnd() must be called after calling ' + 'elementOpenStart().');
  }
};

/**
  * Makes sure that tags are correctly nested.
  * @param {string} nodeName
  * @param {string} tag
  */
var assertCloseMatchesOpenTag = function (nodeName, tag) {
  if (nodeName !== tag) {
    throw new Error('Received a call to close "' + tag + '" but "' + nodeName + '" was open.');
  }
};

/**
 * Makes sure that no children elements have been declared yet in the current
 * element.
 * @param {string} functionName
 * @param {?Node} previousNode
 */
var assertNoChildrenDeclaredYet = function (functionName, previousNode) {
  if (previousNode !== null) {
    throw new Error(functionName + '() must come before any child ' + 'declarations inside the current element.');
  }
};

/**
 * Checks that a call to patchOuter actually patched the element.
 * @param {?Node} startNode The value for the currentNode when the patch
 *     started.
 * @param {?Node} currentNode The currentNode when the patch finished.
 * @param {?Node} expectedNextNode The Node that is expected to follow the
 *    currentNode after the patch;
 * @param {?Node} expectedPrevNode The Node that is expected to preceed the
 *    currentNode after the patch.
 */
var assertPatchElementNoExtras = function (startNode, currentNode, expectedNextNode, expectedPrevNode) {
  var wasUpdated = currentNode.nextSibling === expectedNextNode && currentNode.previousSibling === expectedPrevNode;
  var wasChanged = currentNode.nextSibling === startNode.nextSibling && currentNode.previousSibling === expectedPrevNode;
  var wasRemoved = currentNode === startNode;

  if (!wasUpdated && !wasChanged && !wasRemoved) {
    throw new Error('There must be exactly one top level call corresponding ' + 'to the patched element.');
  }
};

/**
 * Updates the state of being in an attribute declaration.
 * @param {boolean} value
 * @return {boolean} the previous value.
 */
var setInAttributes = function (value) {
  var previous = inAttributes;
  inAttributes = value;
  return previous;
};

/**
 * Updates the state of being in a skip element.
 * @param {boolean} value
 * @return {boolean} the previous value.
 */
var setInSkip = function (value) {
  var previous = inSkip;
  inSkip = value;
  return previous;
};

/**
 * Copyright 2016 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @param {!Node} node
 * @return {boolean} True if the node the root of a document, false otherwise.
 */
var isDocumentRoot = function (node) {
  // For ShadowRoots, check if they are a DocumentFragment instead of if they
  // are a ShadowRoot so that this can work in 'use strict' if ShadowRoots are
  // not supported.
  return node instanceof Document || node instanceof DocumentFragment;
};

/**
 * @param {!Node} node The node to start at, inclusive.
 * @param {?Node} root The root ancestor to get until, exclusive.
 * @return {!Array<!Node>} The ancestry of DOM nodes.
 */
var getAncestry = function (node, root) {
  var ancestry = [];
  var cur = node;

  while (cur !== root) {
    ancestry.push(cur);
    cur = cur.parentNode;
  }

  return ancestry;
};

/**
 * @param {!Node} node
 * @return {!Node} The root node of the DOM tree that contains node.
 */
var getRoot = function (node) {
  var cur = node;
  var prev = cur;

  while (cur) {
    prev = cur;
    cur = cur.parentNode;
  }

  return prev;
};

/**
 * @param {!Node} node The node to get the activeElement for.
 * @return {?Element} The activeElement in the Document or ShadowRoot
 *     corresponding to node, if present.
 */
var getActiveElement = function (node) {
  var root = getRoot(node);
  return isDocumentRoot(root) ? root.activeElement : null;
};

/**
 * Gets the path of nodes that contain the focused node in the same document as
 * a reference node, up until the root.
 * @param {!Node} node The reference node to get the activeElement for.
 * @param {?Node} root The root to get the focused path until.
 * @return {!Array<Node>}
 */
var getFocusedPath = function (node, root) {
  var activeElement = getActiveElement(node);

  if (!activeElement || !node.contains(activeElement)) {
    return [];
  }

  return getAncestry(activeElement, root);
};

/**
 * Like insertBefore, but instead instead of moving the desired node, instead
 * moves all the other nodes after.
 * @param {?Node} parentNode
 * @param {!Node} node
 * @param {?Node} referenceNode
 */
var moveBefore = function (parentNode, node, referenceNode) {
  var insertReferenceNode = node.nextSibling;
  var cur = referenceNode;

  while (cur !== node) {
    var next = cur.nextSibling;
    parentNode.insertBefore(cur, insertReferenceNode);
    cur = next;
  }
};

/** @type {?Context} */
var context = null;

/** @type {?Node} */
var currentNode = null;

/** @type {?Node} */
var currentParent = null;

/** @type {?Document} */
var doc = null;

/**
 * @param {!Array<Node>} focusPath The nodes to mark.
 * @param {boolean} focused Whether or not they are focused.
 */
var markFocused = function (focusPath, focused) {
  for (var i = 0; i < focusPath.length; i += 1) {
    getData(focusPath[i]).focused = focused;
  }
};

/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 * @param {function((!Element|!DocumentFragment),!function(T),T=): ?Node} run
 * @return {function((!Element|!DocumentFragment),!function(T),T=): ?Node}
 * @template T
 */
var patchFactory = function (run) {
  /**
   * TODO(moz): These annotations won't be necessary once we switch to Closure
   * Compiler's new type inference. Remove these once the switch is done.
   *
   * @param {(!Element|!DocumentFragment)} node
   * @param {!function(T)} fn
   * @param {T=} data
   * @return {?Node} node
   * @template T
   */
  var f = function (node, fn, data) {
    var prevContext = context;
    var prevDoc = doc;
    var prevCurrentNode = currentNode;
    var prevCurrentParent = currentParent;
    var previousInAttributes = false;
    var previousInSkip = false;

    context = new Context();
    doc = node.ownerDocument;
    currentParent = node.parentNode;

    if (process.env.NODE_ENV !== 'production') {
      previousInAttributes = setInAttributes(false);
      previousInSkip = setInSkip(false);
    }

    var focusPath = getFocusedPath(node, currentParent);
    markFocused(focusPath, true);
    var retVal = run(node, fn, data);
    markFocused(focusPath, false);

    if (process.env.NODE_ENV !== 'production') {
      assertVirtualAttributesClosed();
      setInAttributes(previousInAttributes);
      setInSkip(previousInSkip);
    }

    context.notifyChanges();

    context = prevContext;
    doc = prevDoc;
    currentNode = prevCurrentNode;
    currentParent = prevCurrentParent;

    return retVal;
  };
  return f;
};

/**
 * Patches the document starting at node with the provided function. This
 * function may be called during an existing patch operation.
 * @param {!Element|!DocumentFragment} node The Element or Document
 *     to patch.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @return {!Node} The patched node.
 * @template T
 */
var patchInner = patchFactory(function (node, fn, data) {
  currentNode = node;

  enterNode();
  fn(data);
  exitNode();

  if (process.env.NODE_ENV !== 'production') {
    assertNoUnclosedTags(currentNode, node);
  }

  return node;
});

/**
 * Patches an Element with the the provided function. Exactly one top level
 * element call should be made corresponding to `node`.
 * @param {!Element} node The Element where the patch should start.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM. This should have at most one top level
 *     element call.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @return {?Node} The node if it was updated, its replacedment or null if it
 *     was removed.
 * @template T
 */
var patchOuter = patchFactory(function (node, fn, data) {
  var startNode = /** @type {!Element} */{ nextSibling: node };
  var expectedNextNode = null;
  var expectedPrevNode = null;

  if (process.env.NODE_ENV !== 'production') {
    expectedNextNode = node.nextSibling;
    expectedPrevNode = node.previousSibling;
  }

  currentNode = startNode;
  fn(data);

  if (process.env.NODE_ENV !== 'production') {
    assertPatchElementNoExtras(startNode, currentNode, expectedNextNode, expectedPrevNode);
  }

  if (node !== currentNode && node.parentNode) {
    removeChild(currentParent, node, getData(currentParent).keyMap);
  }

  return startNode === currentNode ? null : currentNode;
});

/**
 * Checks whether or not the current node matches the specified nodeName and
 * key.
 *
 * @param {!Node} matchNode A node to match the data to.
 * @param {?string} nodeName The nodeName for this node.
 * @param {?string=} key An optional key that identifies a node.
 * @return {boolean} True if the node matches, false otherwise.
 */
var matches = function (matchNode, nodeName, key) {
  var data = getData(matchNode);

  // Key check is done using double equals as we want to treat a null key the
  // same as undefined. This should be okay as the only values allowed are
  // strings, null and undefined so the == semantics are not too weird.
  return nodeName === data.nodeName && key == data.key;
};

/**
 * Aligns the virtual Element definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param {string} nodeName For an Element, this should be a valid tag string.
 *     For a Text, this should be #text.
 * @param {?string=} key The key used to identify this element.
 */
var alignWithDOM = function (nodeName, key) {
  if (currentNode && matches(currentNode, nodeName, key)) {
    return;
  }

  var parentData = getData(currentParent);
  var currentNodeData = currentNode && getData(currentNode);
  var keyMap = parentData.keyMap;
  var node = undefined;

  // Check to see if the node has moved within the parent.
  if (key) {
    var keyNode = keyMap[key];
    if (keyNode) {
      if (matches(keyNode, nodeName, key)) {
        node = keyNode;
      } else if (keyNode === currentNode) {
        context.markDeleted(keyNode);
      } else {
        removeChild(currentParent, keyNode, keyMap);
      }
    }
  }

  // Create the node if it doesn't exist.
  if (!node) {
    if (nodeName === '#text') {
      node = createText(doc);
    } else {
      node = createElement(doc, currentParent, nodeName, key);
    }

    if (key) {
      keyMap[key] = node;
    }

    context.markCreated(node);
  }

  // Re-order the node into the right position, preserving focus if either
  // node or currentNode are focused by making sure that they are not detached
  // from the DOM.
  if (getData(node).focused) {
    // Move everything else before the node.
    moveBefore(currentParent, node, currentNode);
  } else if (currentNodeData && currentNodeData.key && !currentNodeData.focused) {
    // Remove the currentNode, which can always be added back since we hold a
    // reference through the keyMap. This prevents a large number of moves when
    // a keyed item is removed or moved backwards in the DOM.
    currentParent.replaceChild(node, currentNode);
    parentData.keyMapValid = false;
  } else {
    currentParent.insertBefore(node, currentNode);
  }

  currentNode = node;
};

/**
 * @param {?Node} node
 * @param {?Node} child
 * @param {?Object<string, !Element>} keyMap
 */
var removeChild = function (node, child, keyMap) {
  node.removeChild(child);
  context.markDeleted( /** @type {!Node}*/child);

  var key = getData(child).key;
  if (key) {
    delete keyMap[key];
  }
};

/**
 * Clears out any unvisited Nodes, as the corresponding virtual element
 * functions were never called for them.
 */
var clearUnvisitedDOM = function () {
  var node = currentParent;
  var data = getData(node);
  var keyMap = data.keyMap;
  var keyMapValid = data.keyMapValid;
  var child = node.lastChild;
  var key = undefined;

  if (child === currentNode && keyMapValid) {
    return;
  }

  while (child !== currentNode) {
    removeChild(node, child, keyMap);
    child = node.lastChild;
  }

  // Clean the keyMap, removing any unusued keys.
  if (!keyMapValid) {
    for (key in keyMap) {
      child = keyMap[key];
      if (child.parentNode !== node) {
        context.markDeleted(child);
        delete keyMap[key];
      }
    }

    data.keyMapValid = true;
  }
};

/**
 * Changes to the first child of the current node.
 */
var enterNode = function () {
  currentParent = currentNode;
  currentNode = null;
};

/**
 * @return {?Node} The next Node to be patched.
 */
var getNextNode = function () {
  if (currentNode) {
    return currentNode.nextSibling;
  } else {
    return currentParent.firstChild;
  }
};

/**
 * Changes to the next sibling of the current node.
 */
var nextNode = function () {
  currentNode = getNextNode();
};

/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
var exitNode = function () {
  clearUnvisitedDOM();

  currentNode = currentParent;
  currentParent = currentParent.parentNode;
};

/**
 * Makes sure that the current node is an Element with a matching tagName and
 * key.
 *
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @return {!Element} The corresponding Element.
 */
var coreElementOpen = function (tag, key) {
  nextNode();
  alignWithDOM(tag, key);
  enterNode();
  return (/** @type {!Element} */currentParent
  );
};

/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 *
 * @return {!Element} The corresponding Element.
 */
var coreElementClose = function () {
  if (process.env.NODE_ENV !== 'production') {
    setInSkip(false);
  }

  exitNode();
  return (/** @type {!Element} */currentNode
  );
};

/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 *
 * @return {!Text} The corresponding Text Node.
 */
var coreText = function () {
  nextNode();
  alignWithDOM('#text', null);
  return (/** @type {!Text} */currentNode
  );
};

/**
 * Gets the current Element being patched.
 * @return {!Element}
 */
var currentElement = function () {
  if (process.env.NODE_ENV !== 'production') {
    assertInPatch('currentElement', context);
    assertNotInAttributes('currentElement');
  }
  return (/** @type {!Element} */currentParent
  );
};

/**
 * @return {Node} The Node that will be evaluated for the next instruction.
 */
var currentPointer = function () {
  if (process.env.NODE_ENV !== 'production') {
    assertInPatch('currentPointer', context);
    assertNotInAttributes('currentPointer');
  }
  return getNextNode();
};

/**
 * Skips the children in a subtree, allowing an Element to be closed without
 * clearing out the children.
 */
var skip = function () {
  if (process.env.NODE_ENV !== 'production') {
    assertNoChildrenDeclaredYet('skip', currentNode);
    setInSkip(true);
  }
  currentNode = currentParent.lastChild;
};

/**
 * Skips the next Node to be patched, moving the pointer forward to the next
 * sibling of the current pointer.
 */
var skipNode = nextNode;

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @const */
var symbols = {
  default: '__default'
};

/**
 * @param {string} name
 * @return {string|undefined} The namespace to use for the attribute.
 */
var getNamespace = function (name) {
  if (name.lastIndexOf('xml:', 0) === 0) {
    return 'http://www.w3.org/XML/1998/namespace';
  }

  if (name.lastIndexOf('xlink:', 0) === 0) {
    return 'http://www.w3.org/1999/xlink';
  }
};

/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {?(boolean|number|string)=} value The attribute's value.
 */
var applyAttr = function (el, name, value) {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    var attrNS = getNamespace(name);
    if (attrNS) {
      el.setAttributeNS(attrNS, name, value);
    } else {
      el.setAttribute(name, value);
    }
  }
};

/**
 * Applies a property to a given Element.
 * @param {!Element} el
 * @param {string} name The property's name.
 * @param {*} value The property's value.
 */
var applyProp = function (el, name, value) {
  el[name] = value;
};

/**
 * Applies a value to a style declaration. Supports CSS custom properties by
 * setting properties containing a dash using CSSStyleDeclaration.setProperty.
 * @param {CSSStyleDeclaration} style
 * @param {!string} prop
 * @param {*} value
 */
var setStyleValue = function (style, prop, value) {
  if (prop.indexOf('-') >= 0) {
    style.setProperty(prop, /** @type {string} */value);
  } else {
    style[prop] = value;
  }
};

/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} style The style to set. Either a string of css or an object
 *     containing property-value pairs.
 */
var applyStyle = function (el, name, style) {
  if (typeof style === 'string') {
    el.style.cssText = style;
  } else {
    el.style.cssText = '';
    var elStyle = el.style;
    var obj = /** @type {!Object<string,string>} */style;

    for (var prop in obj) {
      if (has(obj, prop)) {
        setStyleValue(elStyle, prop, obj[prop]);
      }
    }
  }
};

/**
 * Updates a single attribute on an Element.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 */
var applyAttributeTyped = function (el, name, value) {
  var type = typeof value;

  if (type === 'object' || type === 'function') {
    applyProp(el, name, value);
  } else {
    applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
  }
};

/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value.
 */
var updateAttribute = function (el, name, value) {
  var data = getData(el);
  var attrs = data.attrs;

  if (attrs[name] === value) {
    return;
  }

  var mutator = attributes[name] || attributes[symbols.default];
  mutator(el, name, value);

  attrs[name] = value;
};

/**
 * A publicly mutable object to provide custom mutators for attributes.
 * @const {!Object<string, function(!Element, string, *)>}
 */
var attributes = createMap();

// Special generic mutator that's called for any attribute that does not
// have a specific mutator.
attributes[symbols.default] = applyAttributeTyped;

attributes['style'] = applyStyle;

/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @const
 */
var ATTRIBUTES_OFFSET = 3;

/**
 * Builds an array of arguments for use with elementOpenStart, attr and
 * elementOpenEnd.
 * @const {Array<*>}
 */
var argsBuilder = [];

/**
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args, Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
var elementOpen = function (tag, key, statics, var_args) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('elementOpen');
    assertNotInSkip('elementOpen');
  }

  var node = coreElementOpen(tag, key);
  var data = getData(node);

  if (!data.staticsApplied) {
    if (statics) {
      for (var _i = 0; _i < statics.length; _i += 2) {
        var name = /** @type {string} */statics[_i];
        var value = statics[_i + 1];
        updateAttribute(node, name, value);
      }
    }
    // Down the road, we may want to keep track of the statics array to use it
    // as an additional signal about whether a node matches or not. For now,
    // just use a marker so that we do not reapply statics.
    data.staticsApplied = true;
  }

  /*
   * Checks to see if one or more attributes have changed for a given Element.
   * When no attributes have changed, this is much faster than checking each
   * individual argument. When attributes have changed, the overhead of this is
   * minimal.
   */
  var attrsArr = data.attrsArr;
  var newAttrs = data.newAttrs;
  var isNew = !attrsArr.length;
  var i = ATTRIBUTES_OFFSET;
  var j = 0;

  for (; i < arguments.length; i += 2, j += 2) {
    var _attr = arguments[i];
    if (isNew) {
      attrsArr[j] = _attr;
      newAttrs[_attr] = undefined;
    } else if (attrsArr[j] !== _attr) {
      break;
    }

    var value = arguments[i + 1];
    if (isNew || attrsArr[j + 1] !== value) {
      attrsArr[j + 1] = value;
      updateAttribute(node, _attr, value);
    }
  }

  if (i < arguments.length || j < attrsArr.length) {
    for (; i < arguments.length; i += 1, j += 1) {
      attrsArr[j] = arguments[i];
    }

    if (j < attrsArr.length) {
      attrsArr.length = j;
    }

    /*
     * Actually perform the attribute update.
     */
    for (i = 0; i < attrsArr.length; i += 2) {
      var name = /** @type {string} */attrsArr[i];
      var value = attrsArr[i + 1];
      newAttrs[name] = value;
    }

    for (var _attr2 in newAttrs) {
      updateAttribute(node, _attr2, newAttrs[_attr2]);
      newAttrs[_attr2] = undefined;
    }
  }

  return node;
};

/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a elementClose tag is required. This is
 * like elementOpen, but the attributes are defined using the attr function
 * rather than being passed as arguments. Must be folllowed by 0 or more calls
 * to attr, then a call to elementOpenEnd.
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 */
var elementOpenStart = function (tag, key, statics) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('elementOpenStart');
    setInAttributes(true);
  }

  argsBuilder[0] = tag;
  argsBuilder[1] = key;
  argsBuilder[2] = statics;
};

/***
 * Defines a virtual attribute at this point of the DOM. This is only valid
 * when called between elementOpenStart and elementOpenEnd.
 *
 * @param {string} name
 * @param {*} value
 */
var attr = function (name, value) {
  if (process.env.NODE_ENV !== 'production') {
    assertInAttributes('attr');
  }

  argsBuilder.push(name);
  argsBuilder.push(value);
};

/**
 * Closes an open tag started with elementOpenStart.
 * @return {!Element} The corresponding Element.
 */
var elementOpenEnd = function () {
  if (process.env.NODE_ENV !== 'production') {
    assertInAttributes('elementOpenEnd');
    setInAttributes(false);
  }

  var node = elementOpen.apply(null, argsBuilder);
  argsBuilder.length = 0;
  return node;
};

/**
 * Closes an open virtual Element.
 *
 * @param {string} tag The element's tag.
 * @return {!Element} The corresponding Element.
 */
var elementClose = function (tag) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('elementClose');
  }

  var node = coreElementClose();

  if (process.env.NODE_ENV !== 'production') {
    assertCloseMatchesOpenTag(getData(node).nodeName, tag);
  }

  return node;
};

/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
var elementVoid = function (tag, key, statics, var_args) {
  elementOpen.apply(null, arguments);
  return elementClose(tag);
};

/**
 * Declares a virtual Text at this point in the document.
 *
 * @param {string|number|boolean} value The value of the Text.
 * @param {...(function((string|number|boolean)):string)} var_args
 *     Functions to format the value which are called only when the value has
 *     changed.
 * @return {!Text} The corresponding text node.
 */
var text = function (value, var_args) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('text');
    assertNotInSkip('text');
  }

  var node = coreText();
  var data = getData(node);

  if (data.text !== value) {
    data.text = /** @type {string} */value;

    var formatted = value;
    for (var i = 1; i < arguments.length; i += 1) {
      /*
       * Call the formatter function directly to prevent leaking arguments.
       * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
       */
      var fn = arguments[i];
      formatted = fn(formatted);
    }

    node.data = formatted;
  }

  return node;
};

exports.patch = patchInner;
exports.patchInner = patchInner;
exports.patchOuter = patchOuter;
exports.currentElement = currentElement;
exports.currentPointer = currentPointer;
exports.skip = skip;
exports.skipNode = skipNode;
exports.elementVoid = elementVoid;
exports.elementOpenStart = elementOpenStart;
exports.elementOpenEnd = elementOpenEnd;
exports.elementOpen = elementOpen;
exports.elementClose = elementClose;
exports.text = text;
exports.attr = attr;
exports.symbols = symbols;
exports.attributes = attributes;
exports.applyAttr = applyAttr;
exports.applyProp = applyProp;
exports.notifications = notifications;
exports.importNode = importNode;

//# sourceMappingURL=incremental-dom-cjs.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/process/browser.js")))

/***/ }),

/***/ "../node_modules/is-callable/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class /;
var isES6ClassFn = function isES6ClassFn(value) {
	try {
		var fnStr = fnToStr.call(value);
		var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
		var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
		var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
		return constructorRegex.test(spaceStripped);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionObject(value) {
	try {
		if (isES6ClassFn(value)) {
			return false;
		}
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isCallable(value) {
	if (!value) {
		return false;
	}
	if (typeof value !== 'function' && typeof value !== 'object') {
		return false;
	}
	if (hasToStringTag) {
		return tryFunctionObject(value);
	}
	if (isES6ClassFn(value)) {
		return false;
	}
	var strClass = toStr.call(value);
	return strClass === fnClass || strClass === genClass;
};

/***/ }),

/***/ "../node_modules/is-date-object/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};

/***/ }),

/***/ "../node_modules/is-regex/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = __webpack_require__("../node_modules/has/src/index.js");
var regexExec = RegExp.prototype.exec;
var gOPD = Object.getOwnPropertyDescriptor;

var tryRegexExecCall = function tryRegexExec(value) {
	try {
		var lastIndex = value.lastIndex;
		value.lastIndex = 0;

		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	} finally {
		value.lastIndex = lastIndex;
	}
};
var toStr = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isRegex(value) {
	if (!value || typeof value !== 'object') {
		return false;
	}
	if (!hasToStringTag) {
		return toStr.call(value) === regexClass;
	}

	var descriptor = gOPD(value, 'lastIndex');
	var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
	if (!hasLastIndexDataProperty) {
		return false;
	}

	return tryRegexExecCall(value);
};

/***/ }),

/***/ "../node_modules/is-symbol/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') {
			return false;
		}
		return symStringRegex.test(symToStr.call(value));
	};
	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') {
			return true;
		}
		if (toStr.call(value) !== '[object Symbol]') {
			return false;
		}
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {
	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false;
	};
}

/***/ }),

/***/ "../node_modules/klak/src/emitter.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var internals = {};

internals.TypeFilter = function (type) {
  return function (value) {
    return value.type === type;
  };
};
internals.EqualityFilter = function (value) {
  return function (input) {
    return input === value;
  };
};

internals.getListener = function (value) {
  return value.listener;
};
internals.isString = function (input) {
  return typeof input === 'string';
};
internals.isArray = function (input) {
  return input instanceof Array;
};
internals.isFunction = function (input) {
  return typeof input === 'function';
};
internals.isEmpty = function (input) {
  return input.length < 1;
};
internals.assert = function (condition, message) {
  if (!condition) throw new Error(message);
};
internals.ArgumentCheck = function (types, method) {
  var assert = internals.assert,
      isArray = internals.isArray,
      isString = internals.isString,
      isFunction = internals.isFunction,
      isEmpty = internals.isEmpty;


  assert(isFunction(method), '\'method\' must be a function');

  var check = function check(type, listener) {

    if (isArray(type)) return type.forEach(function (type) {
      return check(type, listener);
    });

    assert(isString(type) && !isEmpty(type), '\'type\' must be a string');

    assert(types.includes(type), '"' + type + '" listener type is not allowed');

    if (isArray(listener)) return listener.forEach(function (handler) {
      return check(type, handler);
    });

    assert(isFunction(listener), '\'listener\' must be a function');

    method(type, listener);
  };

  return check;
};

internals.Emitter = module.exports = function (allowedTypes) {
  var assert = internals.assert,
      TypeFilter = internals.TypeFilter,
      EqualityFilter = internals.EqualityFilter,
      getListener = internals.getListener,
      isArray = internals.isArray,
      isString = internals.isString,
      isEmpty = internals.isEmpty;


  assert(isArray(allowedTypes) && !isEmpty(allowedTypes) && allowedTypes.every(isString), '\'types\' must be an array of string');

  var _listeners = [];

  var _getListeners = function _getListeners(type) {
    return _listeners.filter(TypeFilter(type)).map(getListener);
  };
  var _findListener = function _findListener(type, listener) {
    return _getListeners(type).find(EqualityFilter(listener));
  };

  var emitter = {
    on: function on(type, listener) {

      if (_findListener(type, listener)) return;

      _listeners.push({ type: type, listener: listener });
    },
    off: function off(type, listener) {

      var found = _findListener(type, listener);

      if (!found) return;

      _listeners.splice(_listeners.findIndex(function (item) {
        return item.type === type && item.listener === found;
      }), 1);
    },
    emit: function emit(type) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      assert(isString(type) && !isEmpty(type), '\'type\' must be a string');

      _getListeners(type).forEach(function (handler) {
        return void handler.apply(undefined, args);
      });
    }
  };

  emitter.on = internals.ArgumentCheck(allowedTypes, emitter.on);
  emitter.off = internals.ArgumentCheck(allowedTypes, emitter.off);

  return emitter;
};

/***/ }),

/***/ "../node_modules/object-keys/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// modified from https://github.com/es-shims/es5-shim

var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = __webpack_require__("../node_modules/object-keys/isArguments.js");
var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = function () {
	/* global window */
	if (typeof window === 'undefined') {
		return false;
	}
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}();
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2);
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

/***/ }),

/***/ "../node_modules/object-keys/isArguments.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

/***/ }),

/***/ "../node_modules/object.assign/hasSymbols.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keys = __webpack_require__("../node_modules/object-keys/index.js");

module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
		return false;
	}
	if (typeof Symbol.iterator === 'symbol') {
		return true;
	}

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') {
		return false;
	}

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
		return false;
	}
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
		return false;
	}

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) {
		return false;
	}
	if (keys(obj).length !== 0) {
		return false;
	}
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
		return false;
	}

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
		return false;
	}

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) {
		return false;
	}

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
		return false;
	}

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) {
			return false;
		}
	}

	return true;
};

/***/ }),

/***/ "../node_modules/object.assign/implementation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// modified from https://github.com/es-shims/es6-shim

var keys = __webpack_require__("../node_modules/object-keys/index.js");
var bind = __webpack_require__("../node_modules/function-bind/index.js");
var canBeObject = function (obj) {
	return typeof obj !== 'undefined' && obj !== null;
};
var hasSymbols = __webpack_require__("../node_modules/object.assign/hasSymbols.js")();
var toObject = Object;
var push = bind.call(Function.call, Array.prototype.push);
var propIsEnumerable = bind.call(Function.call, Object.prototype.propertyIsEnumerable);
var originalGetSymbols = hasSymbols ? Object.getOwnPropertySymbols : null;

module.exports = function assign(target, source1) {
	if (!canBeObject(target)) {
		throw new TypeError('target must be an object');
	}
	var objTarget = toObject(target);
	var s, source, i, props, syms, value, key;
	for (s = 1; s < arguments.length; ++s) {
		source = toObject(arguments[s]);
		props = keys(source);
		var getSymbols = hasSymbols && (Object.getOwnPropertySymbols || originalGetSymbols);
		if (getSymbols) {
			syms = getSymbols(source);
			for (i = 0; i < syms.length; ++i) {
				key = syms[i];
				if (propIsEnumerable(source, key)) {
					push(props, key);
				}
			}
		}
		for (i = 0; i < props.length; ++i) {
			key = props[i];
			value = source[key];
			if (propIsEnumerable(source, key)) {
				objTarget[key] = value;
			}
		}
	}
	return objTarget;
};

/***/ }),

/***/ "../node_modules/object.assign/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defineProperties = __webpack_require__("../node_modules/define-properties/index.js");

var implementation = __webpack_require__("../node_modules/object.assign/implementation.js");
var getPolyfill = __webpack_require__("../node_modules/object.assign/polyfill.js");
var shim = __webpack_require__("../node_modules/object.assign/shim.js");

var polyfill = getPolyfill();

defineProperties(polyfill, {
	implementation: implementation,
	getPolyfill: getPolyfill,
	shim: shim
});

module.exports = polyfill;

/***/ }),

/***/ "../node_modules/object.assign/polyfill.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__("../node_modules/object.assign/implementation.js");

var lacksProperEnumerationOrder = function () {
	if (!Object.assign) {
		return false;
	}
	// v8, specifically in node 4.x, has a bug with incorrect property enumeration order
	// note: this does not detect the bug unless there's 20 characters
	var str = 'abcdefghijklmnopqrst';
	var letters = str.split('');
	var map = {};
	for (var i = 0; i < letters.length; ++i) {
		map[letters[i]] = letters[i];
	}
	var obj = Object.assign({}, map);
	var actual = '';
	for (var k in obj) {
		actual += k;
	}
	return str !== actual;
};

var assignHasPendingExceptions = function () {
	if (!Object.assign || !Object.preventExtensions) {
		return false;
	}
	// Firefox 37 still has "pending exception" logic in its Object.assign implementation,
	// which is 72% slower than our shim, and Firefox 40's native implementation.
	var thrower = Object.preventExtensions({ 1: 2 });
	try {
		Object.assign(thrower, 'xy');
	} catch (e) {
		return thrower[1] === 'y';
	}
	return false;
};

module.exports = function getPolyfill() {
	if (!Object.assign) {
		return implementation;
	}
	if (lacksProperEnumerationOrder()) {
		return implementation;
	}
	if (assignHasPendingExceptions()) {
		return implementation;
	}
	return Object.assign;
};

/***/ }),

/***/ "../node_modules/object.assign/shim.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__("../node_modules/define-properties/index.js");
var getPolyfill = __webpack_require__("../node_modules/object.assign/polyfill.js");

module.exports = function shimAssign() {
	var polyfill = getPolyfill();
	define(Object, { assign: polyfill }, { assign: function () {
			return Object.assign !== polyfill;
		} });
	return polyfill;
};

/***/ }),

/***/ "../node_modules/process/browser.js":
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),

/***/ "../node_modules/pwet/src/assertions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var assert = exports.assert = function assert(condition, message) {

  if (condition) return condition;

  throw new Error(message);
};

var isEqualTo = exports.isEqualTo = function isEqualTo(value, input) {
  return input === value;
};
var isTrue = exports.isTrue = function isTrue(input) {
  return isEqualTo(true, input);
};
var isUndefined = exports.isUndefined = function isUndefined(input) {
  return isEqualTo(void 0, input);
};
var isInstanceOf = exports.isInstanceOf = function isInstanceOf(type, input) {
  return input instanceof type;
};
var isArray = exports.isArray = function isArray(input) {
  return isInstanceOf(Array, input);
};
var ofType = exports.ofType = function ofType(type, input) {
  return isEqualTo(type, typeof input === 'undefined' ? 'undefined' : _typeof(input));
};
var isObject = exports.isObject = function isObject(input) {
  return ofType('object', input);
};
var isEmpty = exports.isEmpty = function isEmpty(input) {
  return !input || input.length < 1;
};
var isBoolean = exports.isBoolean = function isBoolean(input) {
  return ofType('boolean', input);
};
var isString = exports.isString = function isString(input) {

  return ofType('string', input);
};
var isFunction = exports.isFunction = function isFunction(input) {
  return ofType('function', input);
};
var isNumber = exports.isNumber = function isNumber(input) {
  return ofType('number', input);
};
var isInteger = exports.isInteger = function isInteger(input) {
  return Number.isInteger(input);
};
var isComponent = exports.isComponent = function isComponent(input) {
  return isObject(input) && input.isPwetComponent === true;
};
var isElement = exports.isElement = function isElement(input) {
  return isInstanceOf(HTMLElement, input);
};
var isUnknownElement = exports.isUnknownElement = function isUnknownElement(input) {
  return Object.prototype.toString.call(input) === '[object HTMLUnknownElement]';
};

/***/ }),

/***/ "../node_modules/pwet/src/attribute.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utilities = __webpack_require__("../node_modules/pwet/src/utilities.js");

var _assertions = __webpack_require__("../node_modules/pwet/src/assertions.js");

var internal = {};

internal.empty = function (val) {
  return val == null;
};
internal.nullOrType = function (type) {
  return function (val) {
    return internal.empty(val) ? null : type(val);
  };
};
internal.zeroOrNumber = function (val) {
  return internal.empty(val) ? 0 : Number(val);
};
internal.attribute = Object.freeze({ source: true });

internal.Attribute = module.exports = function (attribute) {

  (0, _assertions.assert)((0, _assertions.isObject)(attribute), '\'attribute\' must be an object');

  var _attribute$stringify = attribute.stringify,
      stringify = _attribute$stringify === undefined ? _utilities.identity : _attribute$stringify,
      _attribute$parse = attribute.parse,
      parse = _attribute$parse === undefined ? _utilities.identity : _attribute$parse,
      defaultValue = attribute.defaultValue;


  (0, _assertions.assert)((0, _assertions.isFunction)(stringify), '\'stringify\' must be a function');
  (0, _assertions.assert)((0, _assertions.isFunction)(parse), '\'parse\' must be a function');

  return Object.freeze({
    isPwetAttribute: true,
    stringify: stringify,
    parse: parse,
    defaultValue: defaultValue
  });
};

internal.Attribute.isAttribute = function (input) {
  return (0, _assertions.isObject)(input) && input.isPwetAttribute === true;
};

internal.Attribute.array = internal.Attribute({
  coerce: function coerce(val) {
    return Array.isArray(val) ? val : internal.empty(val) ? null : [val];
  },
  defaultValue: Object.freeze([]),
  parse: JSON.parse,
  stringify: JSON.stringify
});

internal.Attribute.boolean = internal.Attribute({
  coerce: Boolean,
  defaultValue: false,
  parse: function parse(val) {
    return !internal.empty(val);
  },
  stringify: function stringify(val) {
    return val ? '' : null;
  }
});

internal.Attribute.number = internal.Attribute({
  defaultValue: 0,
  coerce: internal.zeroOrNumber,
  parse: internal.zeroOrNumber,
  stringify: internal.nullOrType(Number)
});

internal.Attribute.object = internal.Attribute({
  defaultValue: Object.freeze({}),
  parse: JSON.parse,
  stringify: JSON.stringify
});

internal.Attribute.string = internal.Attribute({
  defaultValue: '',
  coerce: String,
  stringify: internal.nullOrType(String)
});

/***/ }),

/***/ "../node_modules/pwet/src/component.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utilities = __webpack_require__("../node_modules/pwet/src/utilities.js");

var _filters = __webpack_require__("../node_modules/pwet/src/filters.js");

var _assertions = __webpack_require__("../node_modules/pwet/src/assertions.js");

var _property = __webpack_require__("../node_modules/pwet/src/property.js");

var _property2 = _interopRequireDefault(_property);

var _attribute = __webpack_require__("../node_modules/pwet/src/attribute.js");

var _attribute2 = _interopRequireDefault(_attribute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var internal = {
  factories: []
};

internal.parseProperties = function (input) {

  var properties = [];

  if (!(0, _assertions.isObject)(input)) return properties;

  var keys = Object.keys(input);

  if ((0, _assertions.isEmpty)(keys)) return properties;

  return keys.reduce(function (properties, key) {

    var property = input[key];

    if (!(0, _assertions.isObject)(property)) property = { defaultValue: property };

    if (_attribute2.default.isAttribute(property)) property = {
      attribute: property
    };

    property.name = key;

    property = (0, _property2.default)(property);

    properties.push(property);

    return properties;
  }, properties);
};

internal.defaultUpdater = function (element, newState, update) {

  update(newState);
};

internal.Component = function (factory, element) {
  var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


  (0, _assertions.assert)(internal.Component.get(factory), '\'factory\' must be a defined component factory');
  (0, _assertions.assert)((0, _assertions.isElement)(element), '\'element\' must be a HTMLElement');

  if (element._component !== void 0) return;

  (0, _assertions.assert)((0, _assertions.isObject)(override), '\'override\' must be an object');

  var _syncingAttributeToProperty = false;
  var _syncingPropertyToAttribute = false;
  var _connected = false;
  var _updating = false;
  var _shadowRoot = false;
  var _rendered = false;
  var _previousState = void 0;
  var _updateArgs = [];

  var _override$update = override.update,
      _update = _override$update === undefined ? factory.update : _override$update,
      _override$render = override.render,
      _render = _override$render === undefined ? factory.render : _override$render,
      _override$attach = override.attach,
      _attach = _override$attach === undefined ? factory.attach : _override$attach,
      _override$detach = override.detach,
      _detach = _override$detach === undefined ? factory.detach : _override$detach;

  var _properties = factory.properties.map(function (property) {

    var defaultValue = property.defaultValue;

    if ((0, _assertions.isFunction)(defaultValue)) defaultValue = defaultValue.bind(null, element);

    return Object.assign({}, property, { defaultValue: defaultValue });
  });

  var _attributes = _properties.filter(function (property) {
    return property.attribute !== false;
  });

  var attach = function attach() {

    if (_connected) return;

    _connected = true;

    if (factory.shadowRoot) _shadowRoot = element.attachShadow(factory.shadowRoot);

    _attach(element);

    if (!_rendered) {
      console.log('not rendered');
      component.update();
    }
  };

  var update = function update() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    (0, _assertions.assert)((0, _assertions.isObject)(state), '\'state\' must be an object');
    var newState = Object.assign(element.state, state);

    _update(element, newState, function (state) {
      var render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


      Object.assign(_state, newState);

      if (!render) return;

      component.render(state);
    });
  };

  var detach = function detach() {

    if (!_connected) return;

    _connected = false;

    _detach(element);
  };

  var render = function render() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var root = element;

    if (factory.shadowRoot) root = _shadowRoot;

    _render.apply(undefined, [element].concat(args));

    _rendered = true;
  };

  var attributeChanged = function attributeChanged(name, oldValue, newValue) {

    if (_syncingPropertyToAttribute) return;

    _properties.forEach(function (property) {
      var name = property.name,
          parse = property.attribute.parse;


      _syncingAttributeToProperty = name;
      element[name] = newValue == null ? newValue : parse(newValue);
      _syncingAttributeToProperty = null;
    });
  };

  var component = Object.freeze({
    isPwetComponent: true,
    attach: attach,
    detach: detach,
    update: update,
    render: render,
    attributeChanged: attributeChanged
  });

  Object.defineProperty(element, 'state', {
    get: function get() {
      return Object.assign({}, _state);
    },
    set: function set(newState) {

      (0, _assertions.assert)((0, _assertions.isObject)(newState), '\'state\' must be an object');

      component.update(newState);
    }
  });

  var _state = _properties.reduce(function (state, property) {
    var name = property.name,
        coerce = property.coerce,
        defaultValue = property.defaultValue,
        attribute = property.attribute;


    Object.defineProperty(element, name, {
      get: function get() {
        return element.state[name];
      },
      set: function set(newValue) {

        element.state = Object.assign(element.state, _defineProperty({}, name, newValue));
      }
    });

    return Object.assign(state, _defineProperty({}, name, /*element.getAttribute(name) || */defaultValue));
  }, {});

  element.update = component.update;
  element.render = component.render;

  return element._component = component;
};

internal.Component.get = function (input) {
  return internal.factories.find((0, _filters.EqualFilter)(input));
};

internal.Component.define = function (factory, options) {

  (0, _assertions.assert)((0, _assertions.isFunction)(factory), '\'factory\' must be a function');

  if (!(0, _assertions.isUndefined)(options)) (0, _assertions.assert)((0, _assertions.isObject)(options), '\'options\' must be an object');

  var tagName = factory.tagName,
      _factory$attributes = factory.attributes,
      attributes = _factory$attributes === undefined ? {} : _factory$attributes;


  (0, _assertions.assert)((0, _assertions.isString)(tagName) && /[a-z0-9-]+/i, '\'tagName\' must be a string ' + tagName);
  (0, _assertions.assert)(!internal.Component.get(factory), 'That component factory is already defined');
  (0, _assertions.assert)(!internal.factories.find((0, _filters.ByFilter)('tagName', tagName)), '\'' + tagName + '\' component is already defined');

  var properties = factory.properties = internal.parseProperties(factory.properties);

  if (!(0, _assertions.isFunction)(factory.attach)) factory.attach = _utilities.noop;
  if (!(0, _assertions.isFunction)(factory.detach)) factory.detach = _utilities.noop;
  if (!(0, _assertions.isFunction)(factory.update)) factory.update = internal.defaultUpdater;
  if (!(0, _assertions.isFunction)(factory.render)) factory.render = _utilities.noop;

  internal.factories.push(factory);

  customElements.define(tagName, function (_HTMLElement) {
    _inherits(_class, _HTMLElement);

    function _class() {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

      _this._component = factory(_this);
      return _this;
    }

    _createClass(_class, [{
      key: 'connectedCallback',
      value: function connectedCallback() {
        var _component;

        (_component = this._component).attach.apply(_component, arguments);
      }
    }, {
      key: 'disconnectedCallback',
      value: function disconnectedCallback() {
        var _component2;

        (_component2 = this._component).detach.apply(_component2, arguments);
      }
    }, {
      key: 'attributeChangedCallback',
      value: function attributeChangedCallback(name, oldValue, newValue) {
        var _component3;

        (_component3 = this._component).attributeChanged.apply(_component3, arguments);
      }
    }, {
      key: 'state',
      get: function get() {
        var _this2 = this;

        return properties.reduce(function (state, property) {
          return Object.assign(state, _defineProperty({}, property.name, _this2[property.name]));
        }, {});
      },
      set: function set(newState) {
        var _this3 = this;

        Object.keys(newState).forEach(function (key) {

          if (properties.find(function (property) {
            return property.name === key;
          })) _this3[key] = newState[key];
        });
      }
    }], [{
      key: 'observedAttributes',
      get: function get() {

        return factory.properties.filter(function (property) {
          return property.attribute;
        }).map(function (property) {
          return property.name;
        });
      }
    }]);

    return _class;
  }(HTMLElement));
};

exports.default = internal.Component;

/***/ }),

/***/ "../node_modules/pwet/src/filters.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ByFilter = exports.ByFilter = function ByFilter(key, value) {
  return function (item) {
    return item[key] === value;
  };
};
var EqualFilter = exports.EqualFilter = function EqualFilter(value) {
  return function (item) {
    return item === value;
  };
};

/***/ }),

/***/ "../node_modules/pwet/src/polyfills/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// NOTE!!!
//
// We have to load polyfills directly from source as non-minified files are not
// published by the polyfills. An issue was raised to discuss this problem and
// to see if it can be resolved.
//
// See https://github.com/webcomponents/custom-elements/issues/45

// ES2015 polyfills required for the polyfills to work in older browsers.
__webpack_require__("../node_modules/array.from/index.js").shim();
__webpack_require__("../node_modules/object.assign/index.js").shim();
__webpack_require__("../node_modules/es6-promise/dist/es6-promise.js").polyfill();

// We have to include this first so that it can patch native. This must be done
// before any polyfills are loaded.
__webpack_require__("../node_modules/pwet/src/polyfills/native-shim.js");

// // Template polyfill is necessary to use shadycss in IE11
// // this comes before custom elements because of
// // https://github.com/webcomponents/template/blob/master/template.js#L39
// require('@webcomponents/template');

// This comes after the native shim because it requries it to be patched first.
__webpack_require__("../node_modules/@webcomponents/custom-elements/src/custom-elements.js");

// // Force the polyfill in Safari 10.0.0 and 10.0.1.
// const { navigator } = window;
// const { userAgent } = navigator;
// const safari = userAgent.indexOf('Safari/60') !== -1;
// const safariVersion = safari && userAgent.match(/Version\/([^\s]+)/)[1];
// const safariVersions = [0, 1].map(v => `10.0.${v}`).concat(['10.0']);
//
// if (safari && safariVersions.indexOf(safariVersion) > -1) {
//   window.ShadyDOM = { force: true };
// }
//
// // ShadyDOM comes first. Both because it may need to be forced and the
// // ShadyCSS polyfill requires it to function.
// require('cloudydom/src/shadydom');
// require('@webcomponents/shadycss/index');

/***/ }),

/***/ "../node_modules/pwet/src/polyfills/native-shim.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.customElements && eval("/**\n * @license\n * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.\n * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt\n * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt\n * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt\n * Code distributed by Google as part of the polymer project is also\n * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt\n */\n\n/**\n * This shim allows elements written in, or compiled to, ES5 to work on native\n * implementations of Custom Elements.\n *\n * ES5-style classes don't work with native Custom Elements because the\n * HTMLElement constructor uses the value of `new.target` to look up the custom\n * element definition for the currently called constructor. `new.target` is only\n * set when `new` is called and is only propagated via super() calls. super()\n * is not emulatable in ES5. The pattern of `SuperClass.call(this)`` only works\n * when extending other ES5-style classes, and does not propagate `new.target`.\n *\n * This shim allows the native HTMLElement constructor to work by generating and\n * registering a stand-in class instead of the users custom element class. This\n * stand-in class's constructor has an actual call to super().\n * `customElements.define()` and `customElements.get()` are both overridden to\n * hide this stand-in class from users.\n *\n * In order to create instance of the user-defined class, rather than the stand\n * in, the stand-in's constructor swizzles its instances prototype and invokes\n * the user-defined constructor. When the user-defined constructor is called\n * directly it creates an instance of the stand-in class to get a real extension\n * of HTMLElement and returns that.\n *\n * There are two important constructors: A patched HTMLElement constructor, and\n * the StandInElement constructor. They both will be called to create an element\n * but which is called first depends on whether the browser creates the element\n * or the user-defined constructor is called directly. The variables\n * `browserConstruction` and `userConstruction` control the flow between the\n * two constructors.\n *\n * This shim should be better than forcing the polyfill because:\n *   1. It's smaller\n *   2. All reaction timings are the same as native (mostly synchronous)\n *   3. All reaction triggering DOM operations are automatically supported\n *\n * There are some restrictions and requirements on ES5 constructors:\n *   1. All constructors in a inheritance hierarchy must be ES5-style, so that\n *      they can be called with Function.call(). This effectively means that the\n *      whole application must be compiled to ES5.\n *   2. Constructors must return the value of the emulated super() call. Like\n *      `return SuperClass.call(this)`\n *   3. The `this` reference should not be used before the emulated super() call\n *      just like `this` is illegal to use before super() in ES6.\n *   4. Constructors should not create other custom elements before the emulated\n *      super() call. This is the same restriction as with native custom\n *      elements.\n *\n *  Compiling valid class-based custom elements to ES5 will satisfy these\n *  requirements with the latest version of popular transpilers.\n */\n(() => {\n  'use strict';\n\n  // Do nothing if `customElements` does not exist.\n  if (!window.customElements) return;\n\n  const NativeHTMLElement = window.HTMLElement;\n  const nativeDefine = window.customElements.define;\n  const nativeGet = window.customElements.get;\n\n  /**\n   * Map of user-provided constructors to tag names.\n   *\n   * @type {Map<Function, string>}\n   */\n  const tagnameByConstructor = new Map();\n\n  /**\n   * Map of tag names to user-provided constructors.\n   *\n   * @type {Map<string, Function>}\n   */\n  const constructorByTagname = new Map();\n\n\n  /**\n   * Whether the constructors are being called by a browser process, ie parsing\n   * or createElement.\n   */\n  let browserConstruction = false;\n\n  /**\n   * Whether the constructors are being called by a user-space process, ie\n   * calling an element constructor.\n   */\n  let userConstruction = false;\n\n  window.HTMLElement = function() {\n    if (!browserConstruction) {\n      const tagname = tagnameByConstructor.get(this.constructor);\n      const fakeClass = nativeGet.call(window.customElements, tagname);\n\n      // Make sure that the fake constructor doesn't call back to this constructor\n      userConstruction = true;\n      const instance = new (fakeClass)();\n      return instance;\n    }\n    // Else do nothing. This will be reached by ES5-style classes doing\n    // HTMLElement.call() during initialization\n    browserConstruction = false;\n  };\n  // By setting the patched HTMLElement's prototype property to the native\n  // HTMLElement's prototype we make sure that:\n  //     document.createElement('a') instanceof HTMLElement\n  // works because instanceof uses HTMLElement.prototype, which is on the\n  // ptototype chain of built-in elements.\n  window.HTMLElement.prototype = NativeHTMLElement.prototype;\n\n  window.customElements.define = (tagname, elementClass) => {\n    const elementProto = elementClass.prototype;\n    const StandInElement = class extends NativeHTMLElement {\n      constructor() {\n        // Call the native HTMLElement constructor, this gives us the\n        // under-construction instance as `this`:\n        super();\n\n        // The prototype will be wrong up because the browser used our fake\n        // class, so fix it:\n        Object.setPrototypeOf(this, elementProto);\n\n        if (!userConstruction) {\n          // Make sure that user-defined constructor bottom's out to a do-nothing\n          // HTMLElement() call\n          browserConstruction = true;\n          // Call the user-defined constructor on our instance:\n          elementClass.call(this);\n        }\n        userConstruction = false;\n      }\n    };\n    const standInProto = StandInElement.prototype;\n    StandInElement.observedAttributes = elementClass.observedAttributes;\n    standInProto.connectedCallback = elementProto.connectedCallback;\n    standInProto.disconnectedCallback = elementProto.disconnectedCallback;\n    standInProto.attributeChangedCallback = elementProto.attributeChangedCallback;\n    standInProto.adoptedCallback = elementProto.adoptedCallback;\n\n    tagnameByConstructor.set(elementClass, tagname);\n    constructorByTagname.set(tagname, elementClass);\n    nativeDefine.call(window.customElements, tagname, StandInElement);\n  };\n\n  window.customElements.get = (tagname) => constructorByTagname.get(tagname);\n\n})();\n");

/***/ }),

/***/ "../node_modules/pwet/src/property.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utilities = __webpack_require__("../node_modules/pwet/src/utilities.js");

var _assertions = __webpack_require__("../node_modules/pwet/src/assertions.js");

var _attribute = __webpack_require__("../node_modules/pwet/src/attribute.js");

var _attribute2 = _interopRequireDefault(_attribute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var internal = {};

internal.Property = module.exports = function (property) {

  console.error('Property()', property);

  (0, _assertions.assert)((0, _assertions.isObject)(property), '\'property\' must be an object');

  var name = property.name,
      _property$attribute = property.attribute,
      attribute = _property$attribute === undefined ? false : _property$attribute,
      _property$coerce = property.coerce,
      coerce = _property$coerce === undefined ? _utilities.identity : _property$coerce,
      defaultValue = property.defaultValue;


  (0, _assertions.assert)((0, _assertions.isString)(name), '\'name\' must be a string');
  (0, _assertions.assert)((0, _assertions.isFunction)(coerce), '\'coerce\' must be a function');

  if (attribute) {

    (0, _assertions.assert)(_attribute2.default.isAttribute(attribute), '\'attribute\' is not an Attribute object');

    if (!(0, _assertions.isUndefined)(attribute.defaultValue)) defaultValue = attribute.defaultValue;
  }

  return Object.freeze(Object.assign(property, {
    name: name,
    attribute: attribute,
    coerce: coerce,
    defaultValue: defaultValue
  }));
};

/***/ }),

/***/ "../node_modules/pwet/src/utilities.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAttached = exports.not = exports.toggle = exports.identity = exports.noop = exports.clone = undefined;

var _assertions = __webpack_require__("../node_modules/pwet/src/assertions.js");

var clone = exports.clone = function clone(input) {
  return !(0, _assertions.isArray)(input) ? (0, _assertions.isObject)(input) ? Object.assign({}, input) : input : input.map(clone);
};

var noop = exports.noop = function noop() {};
var identity = exports.identity = function identity(arg) {
  return arg;
};
var toggle = exports.toggle = function toggle(input) {
  return !input;
};
var not = exports.not = toggle;

var isAttached = exports.isAttached = function isAttached(element) {

  if (element === document) return true;

  element = element.parentNode;
  if (element) return isAttached(element);

  return false;
};

/***/ }),

/***/ "../node_modules/style-attr/lib/index.js":
/***/ (function(module, exports) {



/*:: type Attr = { [key: string]: string | number } */
/*:: type Opts = { preserveNumbers: ?boolean } */

/*

style-attr
====

Very simple parsing and stringifying of style attributes.

`parse`
----

Convert a style attribute string to an object.

*/

/*:: declare function parse (raw: string, opts: ?Opts): Attr */
function parse(raw, opts) {
  opts = opts || {};

  var preserveNumbers = opts.preserveNumbers;
  var trim = function (s) {
    return s.trim();
  };
  var obj = {};

  getKeyValueChunks(raw).map(trim).filter(Boolean).forEach(function (item) {
    // split with `.indexOf` rather than `.split` because the value may also contain colons.
    var pos = item.indexOf(':');
    var key = item.substr(0, pos).trim();
    var val = item.substr(pos + 1).trim();
    if (preserveNumbers && isNumeric(val)) {
      val = Number(val);
    }

    obj[key] = val;
  });

  return obj;
}

/*

`isNumeric`
----

Check if a value is numeric.
Via: https://stackoverflow.com/a/1830844/9324

*/

/*:: declare function isNumeric (n: any): boolean */

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/*

`getKeyValueChunks`
----

Split a string into chunks matching `<key>: <value>`

*/
/*:: declare function getKeyValueChunks (raw: string): Array<string> */
function getKeyValueChunks(raw) {
  var chunks = [];
  var offset = 0;
  var sep = ';';
  var hasUnclosedUrl = /url\([^\)]+$/;
  var chunk = '';
  var nextSplit;
  while (offset < raw.length) {
    nextSplit = raw.indexOf(sep, offset);
    if (nextSplit === -1) {
      nextSplit = raw.length;
    }

    chunk += raw.substring(offset, nextSplit);

    // data URIs can contain semicolons, so make sure we get the whole thing
    if (hasUnclosedUrl.test(chunk)) {
      chunk += ';';
      offset = nextSplit + 1;
      continue;
    }

    chunks.push(chunk);
    chunk = '';
    offset = nextSplit + 1;
  }

  return chunks;
}

/*

`stringify`
----

Convert an object into an attribute string

*/
/*:: declare function stringify (obj: Attr): string */
function stringify(obj) {
  return Object.keys(obj).map(function (key) {
    return key + ':' + obj[key];
  }).join(';');
}

/*

`normalize`
----

Normalize an attribute string (eg. collapse duplicates)

*/
/*:: declare function normalize (str: string, opts: ?Opts): string */
function normalize(str, opts) {
  return stringify(parse(str, opts));
}

module.exports.parse = parse;
module.exports.stringify = stringify;
module.exports.normalize = normalize;

/***/ }),

/***/ "../node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),

/***/ "../node_modules/zwip-player/src/zwip-player.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _zwip = __webpack_require__("../node_modules/zwip/src/index.js");

var _component = __webpack_require__("../node_modules/pwet/src/component.js");

var _component2 = _interopRequireDefault(_component);

var _attribute = __webpack_require__("../node_modules/pwet/src/attribute.js");

var _idomUtil = __webpack_require__("../node_modules/idom-util/src/index.js");

var _assertions = __webpack_require__("../node_modules/pwet/src/assertions.js");

var _utilities = __webpack_require__("../node_modules/pwet/src/utilities.js");

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

var _zwipPlayer = __webpack_require__("../node_modules/css-loader/index.js!../node_modules/stylus-loader/index.js!../node_modules/zwip-player/src/zwip-player.styl");

var _zwipPlayer2 = _interopRequireDefault(_zwipPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var internal = {};

internal.renderControl = function (content, action) {
  var isEnabled = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var args = [null, null, 'onmouseup', action];

  if (!isEnabled) args.push('disabled', true);

  _idomUtil.renderButton.apply(undefined, args.concat([_incrementalDom.text.bind(null, content)]));
};

internal.renderObject = function () {
  var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  Object.keys(object).forEach(function (key) {

    (0, _idomUtil.renderDiv)(function () {
      (0, _idomUtil.renderStrong)(null, null, 'style', 'display:inline-block;width:90px', _incrementalDom.text.bind(null, key + ':\t\t'));
      (0, _idomUtil.renderPre)(_incrementalDom.text.bind(null, object[key]));
    });
  });
};

internal.Player = function (element) {

  var _loaded = false;
  var _animation = false;
  var _playAnimation = _utilities.noop;
  var _reverseAnimation = _utilities.noop;
  var _pauseAnimation = _utilities.noop;
  var _stopAnimation = _utilities.noop;

  var _isLoopStarted = false;
  var _isAnimationStarted = false;

  var _updateLoopState = function _updateLoopState() {

    var state = element.state;

    var loopState = _zwip.Loop.state;

    if (loopState.fps) loopState.fps = Math.round(loopState.fps * 1000) / 1000;

    var _animation$state = _animation.state,
        value = _animation$state.value,
        nbFrames = _animation$state.nbFrames,
        duration = _animation$state.duration,
        played = _animation$state.played,
        currentFrame = _animation$state.currentFrame;


    var animationState = {
      value: (!value ? 0 : Math.round(value * 100)) + '%',
      frames: (currentFrame || 0) + '/' + nbFrames,
      duration: played + '/' + duration
    };

    element.state = Object.assign(state, {
      loopState: loopState,
      animationState: animationState
    });
  };

  var _observer = new MutationObserver(function () {

    if (_loaded) return _observer.disconnect();

    _loaded = true;

    _animation = element.makeAnimation(element.querySelector('.scene'));

    (0, _assertions.assert)(_zwip.Animation.isAnimation(_animation), '\'makeAnimation\' did not return a Zwip animation');

    _playAnimation = function _playAnimation() {
      return _animation.start({ reverse: false });
    };
    _reverseAnimation = function _reverseAnimation() {
      return _animation.start({ reverse: true });
    };
    _pauseAnimation = function _pauseAnimation() {
      return _animation.pause();
    };
    _stopAnimation = function _stopAnimation() {
      return _animation.stop();
    };

    _animation.on('stop', function () {
      return _isAnimationStarted = false;
    });
    _animation.on('start', function () {
      return _isAnimationStarted = true;
    });

    _zwip.Loop.on('start', function () {
      return _isLoopStarted = true;
    });
    _zwip.Loop.on('stop', function () {
      return _isLoopStarted = false;
    });
    _zwip.Loop.on(['pause', 'stop'], _updateLoopState);

    _zwip.Loop.register({
      update: _updateLoopState,
      frequency: 10
    }, false);

    _updateLoopState();
  });

  _observer.observe(element, { childList: true, subtree: true });

  var render = function render(element) {
    var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    console.log('render');

    var _Object$assign = Object.assign({}, internal.defaultState, state),
        renderScene = _Object$assign.renderScene;

    (0, _incrementalDom.patch)(element, function () {

      (0, _idomUtil.renderStyle)(_zwipPlayer2.default.toString());

      (0, _idomUtil.renderDiv)(null, null, 'class', 'left', function () {
        (0, _idomUtil.renderDiv)(null, null, 'class', 'scene', renderScene);
        (0, _idomUtil.renderDiv)(null, null, 'class', 'toolbar', function () {
          internal.renderControl('◀', _reverseAnimation, !_isAnimationStarted);
          internal.renderControl('▶', _playAnimation, !_isAnimationStarted);
          internal.renderControl('▮▮', _pauseAnimation, _isAnimationStarted);
          internal.renderControl('◼', _stopAnimation, _isAnimationStarted);
        });
      });

      (0, _idomUtil.renderDiv)(null, null, 'class', 'right', function () {
        (0, _idomUtil.renderElement)('div', null, null, function () {
          (0, _idomUtil.renderH3)(_incrementalDom.text.bind(null, 'Loop state:'));
          internal.renderObject(element.loopState);
          (0, _idomUtil.renderH3)(_incrementalDom.text.bind(null, 'Animation state:'));
          internal.renderObject(element.animationState);
        });
        (0, _idomUtil.renderDiv)(null, null, 'class', 'toolbar', function () {
          internal.renderControl('▶', _zwip.Loop.start, !_isLoopStarted);
          internal.renderControl('▮▮', _zwip.Loop.pause, _isLoopStarted);
          internal.renderControl('◼', _zwip.Loop.stop, _isLoopStarted);
        });
      });
    });
  };

  var component = (0, _component2.default)(internal.Player, element, { render: render });

  return component;
};

internal.Player.tagName = 'zwip-player';

internal.Player.shadowRoot = false;

internal.Player.properties = {
  animationState: {},
  loopState: {},
  makeAnimation: function makeAnimation(element, scene) {

    var title = scene.firstChild;

    var start = function start() {
      return title.style.position = 'absolute';
    };

    var render = function render() {
      return title.style.left = animation.value * (scene.clientWidth - title.clientWidth - 2) + 'px';
    };

    var animation = (0, _zwip.Animation)({ duration: 10000, start: start, render: render });

    return animation;
  },
  renderScene: function renderScene() {

    (0, _idomUtil.renderElement)('h1', null, null, 'style', 'font-size:24px;', function () {
      (0, _incrementalDom.text)('DEFAULT SCENE');
    });
  }
};
exports.default = internal.Player;

/***/ }),

/***/ "../node_modules/zwip/src/animation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loop = __webpack_require__("../node_modules/zwip/src/loop.js");

var _loop2 = _interopRequireDefault(_loop);

var _klak = __webpack_require__("../node_modules/klak/src/emitter.js");

var _klak2 = _interopRequireDefault(_klak);

var _utils = __webpack_require__("../node_modules/zwip/src/utils.js");

var _easings = __webpack_require__("../node_modules/zwip/src/easings.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var internal = {};

internal.parseEasing = function () {
  var easing = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _easings.easings.linear;


  if (easing) {

    if ((0, _utils.isString)(easing)) {

      if (!_easings.easings[easing]) throw new Error('Unknown "' + easing + '" easing function');

      easing = _easings.easings[easing];
    }

    (0, _utils.isFunction)(easing, 'easing');
  }

  return easing;
};

internal.parseOptions = function (input) {
  var options = {};

  (0, _utils.isObject)(input, 'options');
  (0, _utils.isUndefined)(input.isZwipAnimation, 'isZwipAnimation');

  var start = input.start,
      stop = input.stop,
      update = input.update,
      render = input.render,
      reverse = input.reverse,
      duration = input.duration,
      nbFrames = input.nbFrames,
      easing = input.easing;


  options.start = !start ? _utils.noop : (0, _utils.isFunction)(start, 'start');
  options.stop = !stop ? _utils.noop : (0, _utils.isFunction)(stop, 'stop');
  options.update = !update ? _utils.noop : (0, _utils.isFunction)(update, 'update');
  options.render = !render ? _utils.noop : (0, _utils.isFunction)(render, 'render');
  options.reverse = !!reverse;

  if (!(duration ^ nbFrames)) throw new Error('Exactly one option of [\'duration\', \'nbFrames\'] is required');

  options.duration = duration && (0, _utils.isInteger)(duration, 'duration');
  options.nbFrames = nbFrames && (0, _utils.isInteger)(nbFrames, 'nbFrames');

  options.easing = internal.parseEasing(easing);

  return options;
};

exports.default = internal.Animation = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _options = options = internal.parseOptions(options),
      _start = _options.start,
      _stop = _options.stop,
      _update = _options.update,
      _easing = _options.easing,
      _render = _options.render,
      duration = _options.duration;

  var _options2 = options,
      nbFrames = _options2.nbFrames,
      reverse = _options2.reverse;


  var _startedAt = void 0;
  var _pausedAt = void 0;
  var _pausedTime = void 0;
  var _frameCounter = void 0;

  var animation = {
    isZwipAnimation: true,
    start: function start() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


      if (_startedAt) throw new Error('Animation is already started');

      (0, _utils.isObject)(options, 'options');

      if ('reverse' in options) reverse = !!options.reverse;

      _pausedAt = null;
      _startedAt = Date.now();
      _frameCounter = 0;
      _pausedTime = 0;

      _start(options);

      _loop2.default.register(animation);

      animation.emit('start');
    },
    stop: function stop() {

      _pausedAt = null;
      _startedAt = null;
      _pausedTime = null;

      _stop();

      _loop2.default.deregister(animation);

      animation.emit('stop');
    },
    pause: function pause() {

      if (!_pausedAt) {
        _pausedAt = Date.now();
        animation.emit('unpause');
        return;
      }

      _pausedTime = _pausedTime + (Date.now() - _pausedAt);
      _pausedAt = null;
      animation.emit('pause');
    },
    update: function update() {

      if (!_startedAt) return;

      if (nbFrames && _frameCounter >= nbFrames) return animation.stop();

      _frameCounter++;

      if (duration) {

        var playedTime = animation.played;

        nbFrames = Math.floor(_frameCounter * duration / playedTime);
      }

      _update();
    },
    render: function render() {
      _render();
    },

    get currentFrame() {
      return _frameCounter;
    },
    get pausedAt() {
      return _pausedAt;
    },
    get played() {

      if (!_startedAt) return 0;

      var now = Date.now();

      var totalTime = now - _startedAt;

      if (_pausedAt) totalTime = totalTime - (now - _pausedAt);

      return totalTime - _pausedTime;
    },
    get value() {

      var value = _frameCounter / nbFrames;

      return _easing(!reverse ? value : 1 - value);
    },
    get nbFrames() {

      if (nbFrames) return nbFrames;

      var duration = animation.duration;

      if (!duration) return;

      return duration / 1000 * _loop2.default.fps;
    },
    get duration() {

      if (duration) return duration;

      var nbFrames = animation.nbFrames;

      if (!nbFrames) return;

      return nbFrames / _loop2.default.fps;
    },
    get state() {
      return {
        value: animation.value,
        nbFrames: animation.nbFrames,
        duration: animation.duration,
        played: animation.played,
        currentFrame: animation.currentFrame
      };
    }
  };

  return Object.assign(animation, (0, _klak2.default)(['start', 'stop', 'pause', 'unpause', 'tick']));
};

internal.Animation.isAnimation = function (input) {
  return (0, _utils.isObject)(input) && input.isZwipAnimation === true;
};

/***/ }),

/***/ "../node_modules/zwip/src/easings.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var EaseIn = exports.EaseIn = function EaseIn(power) {
  return function (t) {
    return Math.pow(t, power);
  };
};
var EaseOut = exports.EaseOut = function EaseOut(power) {
  return function (t) {
    return 1 - Math.abs(Math.pow(t - 1, power));
  };
};
var EaseInOut = exports.EaseInOut = function EaseInOut(power) {
  return function (t) {
    return t < .5 ? EaseIn(power)(t * 2) / 2 : EaseOut(power)(t * 2 - 1) / 2 + 0.5;
  };
};

var easings = exports.easings = {
  linear: EaseInOut(1),
  easeInQuad: EaseIn(2),
  easeOutQuad: EaseOut(2),
  easeInOutQuad: EaseInOut(2),
  easeInCubic: EaseIn(3),
  easeOutCubic: EaseOut(3),
  easeInOutCubic: EaseInOut(3),
  easeInQuart: EaseIn(4),
  easeOutQuart: EaseOut(4),
  easeInOutQuart: EaseInOut(4),
  easeInQuint: EaseIn(5),
  easeOutQuint: EaseOut(5),
  easeInOutQuint: EaseInOut(5),
  easeInCirc: function easeInCirc(t) {
    return -(Math.sqrt(1 - easings.easeInQuad(t)) - 1);
  },
  easeOutCirc: function easeOutCirc(t) {
    return Math.sqrt(easings.easeOutQuad(t));
  }
};

/***/ }),

/***/ "../node_modules/zwip/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Loop = exports.Animation = undefined;

var _animation = __webpack_require__("../node_modules/zwip/src/animation.js");

var _animation2 = _interopRequireDefault(_animation);

var _loop = __webpack_require__("../node_modules/zwip/src/loop.js");

var _loop2 = _interopRequireDefault(_loop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Animation = _animation2.default;
exports.Loop = _loop2.default;

/***/ }),

/***/ "../node_modules/zwip/src/loop.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _klak = __webpack_require__("../node_modules/klak/src/emitter.js");

var _klak2 = _interopRequireDefault(_klak);

var _utils = __webpack_require__("../node_modules/zwip/src/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var internals = {
  animations: [],
  listeners: [],
  state: {
    status: 'initialized'
  },
  fps: 60,
  listenerTypes: ['start', 'stop', 'pause', 'unpause']
};

internals.loop = function () {

  if (internals.paused) return;

  internals.requestId = requestAnimationFrame(internals.loop);
  internals.now = Date.now();

  internals.interval = 1000 / internals.fps;
  internals.delta = internals.now - internals.then;

  if (internals.delta > internals.interval) {

    internals.AnimationLoop.frame();
  }
};

internals.MethodCaller = function (key) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  (0, _utils.isRequired)(key, 'key');
  (0, _utils.isString)(key, 'key');

  return function (animation) {

    if (animation[key] && internals.counter % animation.frequency === 0) animation[key].apply(animation, args);
  };
};

internals.emitTick = internals.MethodCaller('emit', 'tick');
internals.callUpdate = internals.MethodCaller('update');
internals.callRender = internals.MethodCaller('render');
internals.callPause = internals.MethodCaller('pause');

internals.isNotPaused = function (object) {
  return !object.pausedAt;
};

internals.AnimationLoop = {
  start: function start() {

    if (internals.requestId) throw new Error('Loop is already started');

    internals.counter = 0;
    internals.paused = null;
    internals.then = Date.now();
    internals.state.status = 'started';

    internals.loop();

    internals.AnimationLoop.emit('start');
  },
  stop: function stop() {

    if (internals.requestId) cancelAnimationFrame(internals.requestId);

    internals.requestId = null;
    internals.state.status = 'stopped';

    internals.AnimationLoop.emit('stop');
  },
  pause: function pause() {

    if (internals.paused) {

      internals.paused = null;
      internals.state.status = 'started';

      internals.animations.forEach(internals.callPause);

      internals.AnimationLoop.emit('unpause');

      internals.loop();
      return;
    }

    internals.animations.forEach(internals.callPause);

    internals.paused = Date.now();
    internals.state.status = 'paused';

    internals.AnimationLoop.emit('pause');
  },
  register: function register(animation) {
    var auto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


    (0, _utils.isObject)(animation, 'animation');

    animation.frequency = animation.frequency || 1;

    (0, _utils.isInteger)(animation.frequency, 'frequency');

    (0, _utils.assert)((0, _utils.isFunction)(animation.render) || (0, _utils.isFunction)(animation.update), '\'render\' or \'update\' method is required');

    animation.render = animation.render || _utils.noop;
    animation.update = animation.update || _utils.noop;

    if (auto && !internals.requestId) internals.AnimationLoop.start();

    if (internals.animations.includes(animation)) return;

    internals.animations.push(animation);
  },
  deregister: function deregister(animation) {
    var auto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


    var index = internals.animations.indexOf(animation);

    if (~index) internals.animations.splice(index, 1);

    if (auto && internals.requestId && !internals.animations.length) internals.AnimationLoop.stop();
  },
  frame: function frame() {

    internals.counter++;

    internals.elapsed = internals.now - internals.then;
    internals.then = internals.now - internals.delta % internals.interval;

    internals.state.fps = 1000 / internals.elapsed;
    internals.state.animations = internals.animations.length;
    internals.state.frames = internals.counter;

    var animations = internals.animations.filter(internals.isNotPaused);

    animations.forEach(internals.emitTick);

    animations.forEach(internals.callUpdate);

    animations.forEach(internals.callRender);
  },


  get state() {
    return internals.state;
  },
  get fps() {
    return internals.fps;
  },
  set fps(newValue) {

    (0, _utils.isInteger)(newValue, 'fps');

    internals.fps = newValue;
  }
};

exports.default = Object.assign(internals.AnimationLoop, (0, _klak2.default)(['start', 'stop', 'pause', 'unpause']));

/***/ }),

/***/ "../node_modules/zwip/src/polyfills.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s);
    var i = matches.length;
    while (--i >= 0 && matches.item(i) !== this) {}
    return i > -1;
  };
}
window.requestAnimationFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(function () {

      callback(+new Date());
    }, 1000 / 60);
  };
}();

/***/ }),

/***/ "../node_modules/zwip/src/utils.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var internals = {};

internals.Assertion = function (check, errorMessage) {

  return function (input, assert) {

    var isTrue = !!check(input);
    if (isTrue) return input || true;

    if (!assert) return false;

    throw new Error('"' + (typeof assert !== 'string' ? 'input' : assert) + '" ' + errorMessage);
  };
};

var assert = exports.assert = function assert(condition, message) {

  if (condition) return condition;

  throw new Error(message);
};

var noop = exports.noop = function noop() {};
var isEqualTo = exports.isEqualTo = function isEqualTo(value) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'is not equal to value';
  return internals.Assertion(function (input) {
    return input === value;
  }, message);
};
var isTrue = exports.isTrue = isEqualTo(true, 'must be true');
var isUndefined = exports.isUndefined = isEqualTo(void 0, 'must be undefined');
var isRequired = exports.isRequired = internals.Assertion(function (input) {
  return !!input;
}, 'is required');
var isInstanceOf = exports.isInstanceOf = function isInstanceOf(type) {
  return internals.Assertion(function (input) {
    return input instanceof type;
  }, 'is not an instance of ' + type.name);
};
var isArray = exports.isArray = isInstanceOf(Array);
var isObject = exports.isObject = internals.Assertion(function (input) {
  return (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object';
}, 'must be an object');
var isString = exports.isString = internals.Assertion(function (input) {
  return typeof input === 'string';
}, 'must be a string');
var isFunction = exports.isFunction = internals.Assertion(function (input) {
  return typeof input === 'function';
}, 'must be a function');
var isNumber = exports.isNumber = internals.Assertion(function (input) {
  return typeof input === 'number';
}, 'must be a number');
var isInteger = exports.isInteger = internals.Assertion(function (input) {
  return Number.isInteger(input);
}, 'must be an integer');

var isElement = exports.isElement = internals.Assertion(function (object) {

  if (!object || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== "object") return false;

  if ((typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === "object") return object instanceof HTMLElement;

  return object.nodeType === 1 && typeof object.nodeName === "string";
}, 'must be a HTMLElement');

var round = exports.round = function round(value, decimals) {

  isNumber(value, 'value');

  isRequired(decimals, 'decimals');
  isInteger(decimals, 'decimals');

  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

/***/ }),

/***/ "../src/animation.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_zwip_src_animation__ = __webpack_require__("../node_modules/zwip/src/animation.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_zwip_src_animation___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_zwip_src_animation__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_style_attr__ = __webpack_require__("../node_modules/style-attr/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_style_attr___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_style_attr__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__ = __webpack_require__("../node_modules/zwip/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_zwip_src_utils___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__);





const FadeAnimation = (options = {}) => {

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__["isObject"])(options, 'options');

  const { element, start: _start = __WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__["noop"], stop: _stop = __WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__["noop"] } = options;

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__["isElement"])(element, 'element');
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__["isFunction"])(_start, 'start');

  let style;

  const update = () => {

    style.opacity = animation.value;
  };

  const render = () => {

    element.setAttribute('style', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_style_attr__["stringify"])(style));
  };

  const start = () => {

    style = element.getAttribute('style');
    style = style ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_style_attr__["parse"])(style) : {};

    style.opacity = element.style.opacity ? parseFloat(element.style.opacity) : animation.reverse ? 0 : 1;

    _start();
  };

  const stop = () => {

    _stop();
  };

  const animation = __WEBPACK_IMPORTED_MODULE_0_zwip_src_animation___default()(Object.assign(options, { update, render, start, stop }));

  return animation;
};

/* harmony default export */ __webpack_exports__["a"] = (FadeAnimation);

/***/ }),

/***/ "./index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_zwip_src_polyfills__ = __webpack_require__("../node_modules/zwip/src/polyfills.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_zwip_src_polyfills___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_zwip_src_polyfills__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pwet_src_polyfills__ = __webpack_require__("../node_modules/pwet/src/polyfills/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pwet_src_polyfills___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_pwet_src_polyfills__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pwet_src_component__ = __webpack_require__("../node_modules/pwet/src/component.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_pwet_src_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_pwet_src_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_zwip_player__ = __webpack_require__("../node_modules/zwip-player/src/zwip-player.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_zwip_player___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_zwip_player__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_idom_util__ = __webpack_require__("../node_modules/idom-util/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_idom_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_idom_util__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__src_animation__ = __webpack_require__("../src/animation.js");







__WEBPACK_IMPORTED_MODULE_2_pwet_src_component___default.a.define(__WEBPACK_IMPORTED_MODULE_3_zwip_player___default.a);

document.addEventListener('DOMContentLoaded', () => {

  const zwipPlayer = document.createElement('zwip-player');

  zwipPlayer.update({
    makeAnimation(scene) {
      console.log('makeAnimation'

      // const circle = scene.appendChild(document.createElement('div'));
      // circle.classList.add('circle');

      );return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__src_animation__["a" /* default */])({
        element: scene.firstChild,
        duration: 1000
      });
      // console.log('makeAnimation', ...args)
    },
    renderScene(scene) {

      console.log('renderScene');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_idom_util__["renderDiv"])(null, null, 'class', 'circle', null);
    }
  });

  document.body.insertBefore(zwipPlayer, document.body.firstChild);
});

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

/******/ });
//# sourceMappingURL=main.js.map