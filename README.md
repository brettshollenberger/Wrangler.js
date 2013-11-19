Wrangler.js
===========

Wrangler wants to ease the work of creating Angular applications by providing tools for Angular developers akin to Rails' libraries.

ActiveSupport
=============

ActiveSupport adds methods to String.prototype to simplify development, such as:

```
person.pluralize()        -> "people"
soliloquies.singularize() -> "soliloquy"
post_comments.classify()  -> "PostComments"
```

ActiveRecord
============

ActiveRecord for Angular is necessarily different from Rails' ActiveRecord. Angular is a purely front-end tool, and 
as such it will either be part RESTful service or respond to socket-based events. Most of the setup and class definition
is abstracted, however, in holding with Rails' "convention over configuration" ideology.

After inheriting from ActiveRecord.Base, model classes are free to define associations:

```
this.hasMany('sensors');
this.belongsTo('system');
```

Validations:

```
this.validates({
  email:                { format: 'email' },
  username:             { presence: true },
  password:             { confirmation: true },
  passwordConfirmation: { presence: true }
});
```

And to interact with resources. Methods are structured such that `$methods` persist to the database, while `methods`
perform local actions. Local actions are cached so that data instances are ensured to be the same across the
Angular system, so that Angular's dirty checking mechanisms always fire.

```
System.new();
System.$create({address: ""});
System.find({id: 1});
System.$update();
System.$delete();
```

ActionView
============

ActionView provides a variety of tools that simplify Angular views, for example:

#### Forms
Forms pull validation logic from and default naming conventions from your models, keeping your code much DRYer than the
average Angular form. While forms are infinitely expandable through basic HTML and your own custom directives, all you
ever have to write is:

```
<form for="user">
    <input ng-model="user.name">
    <input ng-model="user.email">
    <input ng-model="user.zip">
</form>
```

#### Link Helper
The link helper makes your life much simpler. No more running down URLs, or changing the across the entire application,
now it's just:

<a link-to="posts_path">Posts</a>

But it's also wickedly expandable:

<a link-to="map(country, state, city)">View the Map</a>

Just like that you can pass in regular objects exposed on the $scope, and Wrangler will build out a full URL with
the proper params (e.g. '/map/USA/Pennslyvania/Philadelphia').

ActionDispatch
===============
Setting routes with ActionRouter is wicked simple:

  Router
    .resource('cameras')
    .route('/cameras/live-video')
    .route('/posts/:id/comments/:id')
    
Just like in Rails, the router will expand out resourceful paths using the `resource` method, and will defer to default
controller names (CamerasLiveVideoCtrl) and template paths (cameras/live-video.html). Of course, you can always override
these properties if you like.

Check back in soon for more from Wrangler!
