<Table borderless hover responsive>
  <thead>
    <tr>
      <th>user</th>
      <th>Form title</th>
      <th>reactions</th>
      <th>action</th>
    </tr>
  </thead>
  <tbody>
    {allPosts.map((el, index) => {
      <tr>
        <th scope="row">
          <Media className="align-items-center">
            <span className="avatar avatar-sm rounded-circle">
              <img
                alt="..."
                src={`http://localhost:5000${getuserImg(el.posterId)}`}
              />
            </span>
            {findusername(el.posterId)}
          </Media>
        </th>
        <td> {el.title}</td>
        <td>comments:{el.comments.length}|reacts:{el.likers.length} </td>
        <td>
        {chechCurrentuser(el.posterId) === true ? (
                        <>
                          <Button
                            color="danger"
                            onClick={() => handledeletePost(el._id)}
                          >
                            <i
                              className="ni ni-fat-remove"
                              style={{ fontSize: 23 }}
                            />
                          </Button>
                          <Button
                            color=""
                           onClick={()=>{togglefr();setDataToUpadet({post:el._id,title:el.title,
                           picture:el.picture,
                           message:el.message})}}
                          >
                            <i
                              className="ni ni-settings"
                              style={{ fontSize: 23 }}
                            />
                          </Button>
                        </>
                      ) : null}
                      <Button onClick={() => handelSetNewComponent(el)}>
                        See more
                      </Button>
        </td>
      </tr>;
    })}
  </tbody>
</Table>;
