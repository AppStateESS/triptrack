<table class="table table-striped">
  <tbody>
    <tr>
      <th>Last, First name</th>
      <th>Banner ID</th>
      <th>Username/Email</th>
      <th>Phone</th>
    </tr>
    <?php foreach ($listing as $member):extract($member);?>
    <tr>
      <td><?=$lastName, ', ', $firstName?></td>
      <td><?=$bannerId?></td>
      <td><a href="mailto:<?=$email?>"><?=$username?></a></td>
      <td><a href="tel:+1<?=$phone?>"><?=$phone?></a></td>
    </tr>
    <?php endforeach;?>
  </tbody>
</table>