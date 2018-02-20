const express = require('express');
const menuItemsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
    const sql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId';
    const values = {$menuItemId: menuItemId};
    db.get(sql, values, (error, menuItem) => {
      if (error) {
        next(error); 
      } else if (menuItem) {
        req.menuItem = menuItem;
        next();
      } else {
        res.sendStatus(404);
      }
    });
  });

  menuItemsRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM MenuItem WHERE MenuItem.menu_id  = $menuId',
    { $menuId: req.params.menuId},
      (err, menuItems) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({menuItems: menuItems});
        }
      });
});

menuItemsRouter.post('/', (req, res, next) => {
    const name = req.body.menuItem.name,
          description = req.body.menuItem.description,
          inventory = req.body.menuItem.inventory,
          price = req.body.menuItem.price,
          menuId = req.params.menuId;
    if (!name || !inventory || !price || !menuId ) {
      return res.sendStatus(400);
    }
  
    const sql = 'INSERT INTO MenuItem (hours, rate, date, employee_id)' +
        'VALUES ($hours, $rate, $date, $employeeId)';
    const values = {
      $hours: hours,
      $rate: rate,
      $date: date,
      $employeeId: employeeId
    };
  
    db.run(sql, values, function(error) {
      if (error) {
        next(error);
      } else {
        db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`,
          (error, timesheet) => {
            res.status(201).json({timesheet: timesheet});
          });
      }
    });
  });

menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
    const sql = 'DELETE FROM MenuItem WHERE MenuItem.id = $menuItemId';
    const values = {$menuItemId: req.params.menuItemId};
  
    db.run(sql, values, (error) => {
        if(error) {
            next(error);
        } else {
            res.sendStatus(204);
        }
    });
  });


  module.exports = menuItemsRouter;