export const Orders = [
  {
    "order_number": "30",
    "dispatcher_name": "Shubham",
    "customer_name": "Amaan",
    "created_at": new Date().toLocaleDateString(),
    "order_status": "Pending",
    "order_details": {
      "items": [
        {
          "typeof_items": "Bottle",
          "quantity": 100,
          "weight": "500g",
          "team": "Glass Manufacturing Team",
          "status": "Done"
        }
      ],
      "caps": [
        {
          "cap_name": "Plastic Cap",
          "quantity": 100,
          "cap_type": "Screw Cap",
          "team": "Cap Manufacturing Team",
          "status": "Done"
        },
        {
          "cap_name": "Metal Cap",
          "quantity": 50,
          "cap_type": "Twist Cap",
          "team": "Cap Manufacturing Team",
          "status": "Pending"
        }
      ],
      "boxes": [
        {
          "box_name": "Carton Box",
          "quantity": 20,
          "box_finish": "Glossy",
          "team": "Packaging Team",
          "status": "Pending"
        }
      ],
      "pumps": [
        {
          "pump_name": "Dispenser Pump",
          "quantity": 100,
          "team": "Pump Manufacturing Team",
          "status": "Pending"
        },
        {
          "pump_name": "Spray Pump",
          "quantity": 50,
          "team": "Pump Manufacturing Team",
          "status": "Pending"
        }
      ],
      "decorations": [
        {
          "decoration_name": "Logo Sticker",
          "quantity": 100,
          "link": "https://example.com/logo1.png",
          "team": "Decoration Team",
          "status": "Pending"
        }
      ]
    }
  },
  {
    "order_number": "31",
    "dispatcher_name": "Govind",
    "customer_name": "Parth",
    "created_at": new Date().toLocaleDateString(),
    "order_status": "Pending",
    "order_details": {
      "items": [
        {
          "typeof_items": "Jar",
          "quantity": 200,
          "weight": "300g",
          "team": "Glass Manufacturing Team",
          "status": "Done"
        }
      ],
      "caps": [
        {
          "cap_name": "Metal Cap",
          "quantity": 200,
          "cap_type": "Twist Cap",
          "team": "Cap Manufacturing Team",
          "status": "Pending"
        }
      ],
      "boxes": [
        {
          "box_name": "Plastic Box",
          "quantity": 40,
          "box_finish": "Matte",
          "team": "Packaging Team",
          "status": "Pending"
        }
      ],
      "pumps": [
        {
          "pump_name": "Spray Pump",
          "quantity": 200,
          "team": "Pump Manufacturing Team",
          "status": "Pending"
        }
      ],
      "decorations": [
        {
          "decoration_name": "Printed Label",
          "quantity": 200,
          "link": "https://example.com/logo2.png",
          "team": "Decoration Team",
          "status": "Pending"
        }
      ]
    }
  }
]
