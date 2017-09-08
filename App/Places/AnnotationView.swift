/*
 * Copyright (c) 2016 Razeware LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import UIKit
import Alamofire
import SwiftyJSON

protocol AnnotationViewDelegate {
  func didTouch(annotationView: AnnotationView)
}


class AnnotationView: ARAnnotationView {
  var descriptionLabel: UILabel?
  var titleLabel: UILabel?
  var distanceLabel: UILabel?
  var delegate: AnnotationViewDelegate?
  
  var placeM : PlaceModel = PlaceModel(name:"", like: 0, short: "", long: "", comments: [])
  
  override func didMoveToSuperview() {
    super.didMoveToSuperview()
    if let annotation = annotation as? Place {
      var name = annotation.placeName
        name = name.replacingOccurrences(of: " ", with: "%20")
      self.placeM = PlaceModel(name:annotation.placeName, like: 0, short: annotation.short, long: annotation.long, comments: [])
      
      fetchData(url: "https://73c2fc59.ngrok.io/info?name=" + name, msg: "nothing", model : self.placeM, completion: {
        self.loadUI()
      })
    }
  }
  
  func clicked(_ sender:UITapGestureRecognizer) {
    let storyboard = UIStoryboard(name: "Main", bundle: nil)
    let controller = storyboard.instantiateViewController(withIdentifier: "DetailViewController")
    if let detailCtr = controller as? DetailViewController {
      detailCtr.setModel(placeModel:self.placeM)
      
    }
    
    if let wd = self.window {
      
      if let rwc = wd.rootViewController {
        rwc.presentedViewController?.present(controller, animated: true, completion: nil)
      }
    }
  }
  
  func loadUI() {
    
    titleLabel?.removeFromSuperview()
    distanceLabel?.removeFromSuperview()
    descriptionLabel?.removeFromSuperview()
    
    let gesture = UITapGestureRecognizer(target: self, action: #selector(AnnotationView.clicked(_:)))
    self.addGestureRecognizer(gesture)
    
    let label = UILabel(frame: CGRect(x: 10, y: 0, width: self.frame.size.width, height: 30))
    label.font = UIFont.systemFont(ofSize: 15)
    label.numberOfLines = 0
    label.backgroundColor = UIColor(white: 0.3, alpha: 0.7)
    label.textColor = UIColor.white
    self.addSubview(label)
    self.titleLabel = label
    
    distanceLabel = UILabel(frame: CGRect(x: 10, y: 30, width: self.frame.size.width, height: 20))
    distanceLabel?.backgroundColor = UIColor(white: 0.3, alpha: 0.7)
    distanceLabel?.textColor = UIColor.green
    distanceLabel?.font = UIFont.systemFont(ofSize: 12)
    self.addSubview(distanceLabel!)
    
    descriptionLabel = UILabel(frame: CGRect(x: 10, y: 50, width: self.frame.size.width, height: 20))
    descriptionLabel?.backgroundColor = UIColor(white: 0.3, alpha: 0.7)
    descriptionLabel?.textColor = UIColor.green
    descriptionLabel?.font = UIFont.systemFont(ofSize: 12)
    self.addSubview(descriptionLabel!)
    
    if let annotation = annotation as? Place {
      titleLabel?.text = annotation.placeName
      distanceLabel?.text = String(format: "%.0f m", annotation.distanceFromUser)
      descriptionLabel?.text = "Likes: " + String(placeM.like)
      
    }
  }
  
  func fetchData(url: String, msg: String, model: PlaceModel, completion: @escaping () -> Void) {
    Alamofire.request(url).responseJSON { response in
      switch response.result {
      case .success(_):
        let responseData: JSON = JSON(data: response.data!)
        
        var cmarr:[String] = []
        if let arr = responseData["comment"].array {
          for item in arr {
            if let comme = item.string {
              cmarr.append(comme)
            }
          }
        }
        model.like = responseData["like"].intValue
        model.comments = cmarr
      case .failure(let error):
        print(error)
      }
      completion()
    }
  }

  
  
  
  override func layoutSubviews() {
    super.layoutSubviews()
    titleLabel?.frame = CGRect(x: 10, y: 0, width: self.frame.size.width, height: 30)
    distanceLabel?.frame = CGRect(x: 10, y: 30, width: self.frame.size.width, height: 20)
  }
  
  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
    delegate?.didTouch(annotationView: self)
  }
}
