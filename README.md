# Warehouse_Inventory
<h3>Welcome to idkDB</h3>

<p>
  
Project Details:
  
Habitat for Humanity needs a computer system to improve the utilization of the items in the warehouse. The system
shall support the following features at a minimum.
<ul>
<li> When items are received at the warehouse, their descriptions, quantity, and storage location within the
warehouse will be entered into the inventory records, along with the date.
<li> When items are removed from the warehouse, the inventory records will be marked to indicate this fact, along
with the date. The system will maintain a history of items.
<li> When planning a project, a project leader can use the system to reserve materials that are currently in the
warehouse. The system shall prevent conflicting reservations.
<li> The system shall generate inventory reports for project leaders and the organization’s management.
</ul>
Your team is responsible for implementing the hypothetical database
application. This project addresses only a subset of a real
system's requirements.
The database system will be implemented in any DBMS and conventional
programming language of your choice.
<br>
<br>
Purpose: The purpose of the project is to provide students the opportunity to combine
previous knowledge and skills with the knowledge and skills learned in this
course and apply them to a real-world application. 
Habitat for Humanity is a charitable organization that builds homes for poor families. Materials are donated by
businesses and individuals in the community; and labor is contributed by volunteers. Habitat for Humanity is staffed
by volunteers who have a wide range of technical skill levels.
Habitat for Humanity has a warehouse for storage of building materials and home furnishings that will be used in their
projects. Currently, there are no written records of what is in the warehouse. When planning a project, a project
leader walks around the warehouse looking for useful items. These items are either gathered together in one place
or tagged for later pickup.
</p>
<hr>
<h1>USERS MANUAL</h1>
<p>
<strong>Basic User</strong>
<br>
To be able to use our database, you must create an account. Click the Sign Up button to create one! If you already have an account simply click the Log In button and type in your credentials.

Once you are logged in, you will be taken to the User Account page. The default access level is 4. The privileges for access levels are as follows:
<br>
<br>
<strong>0: Admin</strong> – everything, add/delete users, delete items
<br>
<strong>1: Manager</strong> – update all projects, remove and edit items
<br>
<strong>2: Project Manager</strong> – can create projects, update/reassign their project
<br>
<strong>3: Power User</strong> – can add items, update qty, change item info
<br>
<strong>4: Basic User</strong> – can only view inventory
<br>
<br>
Click the hamburger button(only for mobile users) to access the site navigation bar. If you are a Basic User, click Inventory to view the warehouse inventory. If you want to be able to add items, you must contact the system administrator to update your account privileges. Basic users can also access the Search page and Statistics page. When you are finished, click the Logout button.

<strong>Advanced users (Access Levels less than 4)</strong>
<br>
To add your first item, click Inventory and then scroll down until you can see the New Item button. Now enter a brief description, the category, quantity, and storage location. To edit the item you created, click the edit button. You can now edit the contents of the item or remove it if you want. You are also able to see the history of edits of the item.

To create a project, click on Projects. A key feature of our database is the ability to reserve multiple items for building projects. Click New Project and type the name. Next we’re going to learn how to reserve items. Click the Edit button next to your project name, and then click Reserve Items. You should now be able to see the warehouse inventory. Click reserve and enter the quantity of the item you would like to reserve. To see the items that you already have reserved, click show items. It’s as simple as that!

</p>

<br>

![alt text](https://github.com/jakerumbles/Warehouse_Inventory/blob/master/FinalFinishedERdiagramV3.png)
