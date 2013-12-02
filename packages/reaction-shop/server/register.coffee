Meteor.startup ->
  console.log 'Adding Shop to packages'
  PackageConfigs.update
    name: 'reaction-shop',
    label: 'Shop',
    description: 'Reaction Shop',
    icon: 'fa fa-shopping-cart fa-5x',
    route: 'shop',
    template: 'shopwelcome',
    priority: '3',
    metafields: {type: ''}
  , {$set: {}}, {upsert: true}

Meteor.startup ->
  console.log 'Adding Shop Orders to packages'
  PackageConfigs.update
    name: 'reaction-shop-orders',
    label: 'Orders',
    route: 'shop/orders',
    metafields: {type: 'reaction-shop', visible: 'nav'}
  , {$set: {}}, {upsert: true}
