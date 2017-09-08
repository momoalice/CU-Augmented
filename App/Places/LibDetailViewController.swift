//
//  LibDetailViewController.swift
//  Places
//
//  Created by Henry Xing on 4/2/2017.
//  Copyright © 2017 Razeware LLC. All rights reserved.
//

import UIKit

class LibDetailViewController: UIViewController {
  var libTitle: String!
    @IBOutlet var backButton: UIButton!
  var libDescription: String!

    @IBOutlet var libDescriptLabel: UILabel!
    @IBOutlet var libTitleLabel: UILabel!
    
    
    //self.backButton.addTarget(self,action: #selector(self.backClicked), for: .touchUpInside)
  
  
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
      self.libTitleLabel.text = self.libTitle
      self.libDescriptLabel.text = self.libDescription
      self.backButton.addTarget(self, action: #selector(self.backClicked), for: .touchUpInside)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
      
      
    }
  
  func backClicked(){
    self.presentingViewController?.dismiss(animated: true, completion: nil)

  }
  
  open func setFields(title: String, description: String){
    
    self.libTitle = title
    self.libDescription = description
    print(self.libTitle)
    print(self.libDescription)
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
