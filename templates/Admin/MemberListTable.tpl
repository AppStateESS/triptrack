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
      <td><span class="<?=$deleted == 1 ? 'text-danger' : null?>"><?=$lastName, ', ', $firstName?>
          <?php if($deleted == 1):?><abbr title="Member deleted after trip approval"><i
              class="fas fa-trash fa-sm"></i></abbr><?php endif;?>
        </span></td>
      <td><?=$bannerId?></td>
      <td><a href="mailto:<?=$email?>"><?=$username?></a></td>
      <td><a href="tel:+1<?=$phone?>"><?=$phone?></a></td>
    </tr>
    <?php endforeach;?>
  </tbody>
</table>