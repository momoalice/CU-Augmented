//
//  DetailViewController.swift
//  Places
//
//  Created by Henry Xing on 4/2/2017.
//  Copyright © 2017 Razeware LLC. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class DetailViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
  var window: UIWindow?
    
    var placeModel = PlaceModel(name : "", like : 0, short : "", long: "", comments : [])
    
  @IBOutlet var detailButton: UIButton!
    @IBOutlet var commentField: UITextField!
    @IBOutlet var submitButton: UIButton!
  @IBOutlet var fillerLabel: UILabel!
    @IBOutlet var backButton: UIButton!
    
  @IBOutlet var descLabel: UILabel!
    @IBOutlet var headerLabel: UILabel!
  
  @IBOutlet var commentLabel: UILabel!
  @IBOutlet var commentTable: UITableView!
  
  @IBOutlet var likeLabel: UILabel!
  
  @IBOutlet var likeButton: UIButton!
  
    @IBOutlet var fillerLabel2: UILabel!
    override func viewDidLoad() {
        super.viewDidLoad()
        self.backButton.addTarget(self, action: #selector(self.buttonClicked), for: .touchUpInside)
      self.likeButton.addTarget(self, action: #selector(self.liked), for: .touchUpInside)
        self.headerLabel.text = self.placeModel.name
      self.descLabel.text = self.placeModel.short
      self.likeLabel.text = String(self.placeModel.like)
        self.submitButton.addTarget(self, action: #selector(self.submitClicked), for: .touchUpInside)
      self.detailButton.addTarget(self, action: #selector(self.detailShowed), for: .touchUpInside)
        
        
      commentLabel.font = UIFont.boldSystemFont(ofSize: 17)
//      self.descLabel.layer.addBorder(edge: UIRectEdge.top, color: UIColor.black, thickness: 2)
      
      self.fillerLabel.layer.addBorder(edge: UIRectEdge.bottom, color: UIColor.black, thickness: 1)
        self.fillerLabel2.layer.addBorder(edge: UIRectEdge.bottom, color: UIColor.black, thickness: 1)

      self.commentTable.register(UITableViewCell.self, forCellReuseIdentifier: "commentCell")
      commentTable.delegate = self
      commentTable.dataSource = self
      
        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
  open func setModel(placeModel: PlaceModel) {
        self.placeModel = placeModel
    }
    
    func buttonClicked(_ sender: AnyObject?) {
        self.presentingViewController?.dismiss(animated: true, completion: nil)
    }
  
  func detailShowed(_ sender: AnyObject?) {
    let storyboard = UIStoryboard(name: "Main", bundle: nil)
    let controller = storyboard.instantiateViewController(withIdentifier: "LibDetailViewController")
    
    if let libDetailCtr = controller as? LibDetailViewController {
      libDetailCtr.setFields(title:self.placeModel.name,description: self.placeModel.long)
    }
    
    self.present(controller, animated: true, completion: nil)

    
    

  }
    func submitClicked(_ sender: AnyObject?) {
        self.submitCont (
            completion: {
              self.commentTable.reloadData()
            }
        )
    }
  func liked(_ sender: AnyObject?) {
    self.getLike(completion: {
    })
  }
    
    func submitCont(completion: @escaping () -> Void){
        let formatted: String = self.placeModel.name.replacingOccurrences(of: " ", with: "%20")
      var content: String = ""
      if let tmp = self.commentField.text {
        content = tmp.replacingOccurrences(of: " ", with: "%20")
        Alamofire.request("https://73c2fc59.ngrok.io/comment?name=" + formatted + "&comment=" + content).responseJSON { response in
          switch response.result {
          case .success(_):
            self.commentField.text=""
            let responseData: JSON = JSON(data: response.data!)
            var cmarr:[String] = []
            if let arr = responseData["comment"].array {
              for item in arr {
                if let comme = item.string {
                  cmarr.append(comme)
                }
              }
            }
            self.placeModel.comments=cmarr
          case .failure(let error):
            print(error)
          }
          completion()
        }

      }
      
      
        
    }
  
  func getLike(completion: @escaping () -> Void) {
    let formatted: String = self.placeModel.name.replacingOccurrences(of: " ", with: "%20")
    Alamofire.request("https://73c2fc59.ngrok.io/like?name=" + formatted).responseJSON { response in
      switch response.result {
      case .success(_):
        self.placeModel.like = self.placeModel.like + 1
        self.likeLabel.text = String(self.placeModel.like)
      case .failure(let error):
        print(error)
      }
      completion()
    }
  }
  
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return self.placeModel.comments.count
  }
  
  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    
    // create a new cell if needed or reuse an old one
    let cell:UITableViewCell = self.commentTable.dequeueReusableCell(withIdentifier: "commentCell") as UITableViewCell!
    
    // set the text from the data model
    cell.textLabel?.text = self.placeModel.comments[self.placeModel.comments.count - indexPath.row - 1]
    cell.textLabel?.lineBreakMode = NSLineBreakMode.byWordWrapping
    cell.textLabel?.numberOfLines = 0
    
    return cell
  }
  
  func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    print("You tapped cell number \(indexPath.row).")
  }
  
  
  
    
    /*
     // MARK: - Navigation
     
     // In a storyboard-based application, you will often want to do a little preparation before navigation
     override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
     // Get the new view controller using segue.destinationViewController.
     // Pass the selected object to the new view controller.
     }
     */
    
}

extension CALayer {
  
  func addBorder(edge: UIRectEdge, color: UIColor, thickness: CGFloat) {
    
    var border = CALayer()
    
    switch edge {
    case UIRectEdge.top:
      border.frame = CGRect(x: 0, y: 0, width: self.frame.width, height:thickness)
      break
    case UIRectEdge.bottom:
      border.frame = CGRect(x: 0, y: self.frame.height - thickness, width: self.frame.width, height:thickness)
      break
    case UIRectEdge.left:
      border.frame = CGRect(x: 0, y: 0, width: thickness, height: self.frame.height)
      break
    case UIRectEdge.right:
      border.frame = CGRect(x: self.frame.width - thickness, y: 0, width: thickness, height: self.frame.height)
      break
    default:
      break
    }
    
    border.backgroundColor = color.cgColor;
    
    self.addSublayer(border)
  }
  
}
