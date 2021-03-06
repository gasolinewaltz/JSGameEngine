Collection = function(parent){
	/*
	 * the object that manages the collection
	 */
	this.parent = parent;
	
	/*
	 * unique ID for every entity
	 */
	this.index = 0;
	
	/*
	 * if something inside dies, it needs to be removed.
	 */
	this.dirty = false;
};

/*
 * copy array proto
 */

Collection.prototype = new Array;

_.extend(Collection.prototype, {
	
	/*
	 * creates new object instance with given args and pushes it to the collection
	 * 	example:
	 * 		var entities = new ENGINE.Collection <- create the collection
	 * 			entities.add(ENGINE.Soldier, {x:32, y:64});
	 */
	add: function(constructor, args){
		/*
		 *	In order to avoid manualy attaching collection and indexing the new entity,
		 *  we'll create it within the collection which manages the current index
		 *  as well as remove obsolete entities if needed
		 */
		var entity = new constructor(_.extend({
			collection: this,
			index: this.index++
		}, args));

        /*
            we'll call a method "oncreate" for the entity, if it exists,
        */
        if(entity.oncreate){
            entity.oncreate();
        }
		/* since we use Array as a proto, we can call nativ array methods... */
		this.push(entity);
		
		return entity;
	},
	
	/*
	 * remove the dead
	 */
	clean: function(){
		for (var i = 0, len = this.length; i < len; i++){
			if(this[i]._remove){
				this.splice(i--,1);
				len--;
			}
		}
	},
	
	/*
	 * keep track of the garbage
	 */
	
	step: function(delta){
		if (this.dirty){
			//reset the dirty flag
			this.dirty = false;
			
			this.clean();
			
			//sort entities by zIndex
			this.sort(function(a,b){
				return ((a.zIndex | 0) - (b.zIndex | 0));
			});
		}
	},
	/*
	 * call some method of all entities
	 * 	ex: squids.call("moveRight", 32, 24);
	 * 	would invoke the moveRight method from each entities in the collection
	 */
	call: function(method){
		/*
		 * because we need to slice the first argument because it's 
		 * 	a method name, and arguments isn't a proper array...
		 */
		var args = Array.prototype.slice.call(arguments, 1);
		
		for(var i = 0, len = this.length; i < len; i++){
			if(this[i][method]){
				this[i][method].apply(this[i], args);
			}
		}
	},
	
	/*
	 * same as above method, only we will be able to substitute 
	 * an array:
	 * 	squids.apply("moveRight", [32, 24]);
	 * 
	 * i.e., the difference between call and apply
	 */
	apply: function(method, args){
		
		for(var i = 0, len = this.len; i < len; i++){
			if(this[i][method]){
				this[i][method].apply(this[i], args);
			}
		}
	}
	
	
});

module.exports = Collection;